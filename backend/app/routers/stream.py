import json
from uuid import UUID

from fastapi import APIRouter, Header, Query, Request
from fastapi.responses import StreamingResponse

from app.database import AsyncSessionLocal
from app.models.rumble import Rumble
from app.redis_client import get_redis
from app.services.event_bus import parse_stream_event, publish_event, stream_key
from app.services.rumble_orchestrator import start_rumble_task

router = APIRouter()


async def broadcast_vote_update(rumble_id: str, vote_counts: dict) -> None:
    await publish_event(
        str(rumble_id),
        "vote_update",
        {"votes": vote_counts, "total": sum(vote_counts.values())},
    )


@router.get("/rumble/{rumble_id}/stream")
async def stream_rumble(
    rumble_id: UUID,
    request: Request,
    last_event_id: str | None = Header(default=None, alias="Last-Event-ID"),
    cursor: str | None = Query(default=None, alias="last_event_id"),
):
    rumble_id_str = str(rumble_id)

    async def event_generator():
        redis = await get_redis()
        async with AsyncSessionLocal() as session:
            rumble = await session.get(Rumble, rumble_id)
        if not rumble:
            await publish_event(rumble_id_str, "error", {"code": "RUMBLE_NOT_FOUND", "message": "Rumble not found"})
        elif rumble.status == "created":
            start_rumble_task(rumble_id_str)

        last_id = cursor or last_event_id or "0-0"
        while not await request.is_disconnected():
            messages = await redis.xread({stream_key(rumble_id_str): last_id}, count=50, block=30000)
            if not messages:
                yield ": keepalive\n\n"
                continue
            for _, events in messages:
                for event_id, fields in events:
                    last_id = event_id
                    event_type, data = parse_stream_event(fields)
                    yield f"id: {event_id}\n"
                    yield f"event: {event_type}\n"
                    yield f"data: {json.dumps(data, default=str)}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no",
            "Connection": "keep-alive",
            "Access-Control-Allow-Origin": "*",
        },
    )
