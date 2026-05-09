import asyncio
import json

from fastapi import APIRouter, BackgroundTasks
from fastapi.responses import StreamingResponse

from app.services.rumble_orchestrator import run_rumble, running_rumbles

router = APIRouter()
active_streams: dict[str, set[asyncio.Queue]] = {}


async def publish_event(rumble_id: str, event: dict) -> None:
    for queue in active_streams.get(str(rumble_id), set()).copy():
        await queue.put(event)


async def broadcast_vote_update(rumble_id: str, vote_counts: dict) -> None:
    await publish_event(
        rumble_id,
        {"type": "vote_update", "data": {"votes": vote_counts, "total": sum(vote_counts.values())}},
    )


@router.get("/rumble/{rumble_id}/stream")
async def stream_rumble(rumble_id: str, background_tasks: BackgroundTasks):
    queue: asyncio.Queue = asyncio.Queue()
    active_streams.setdefault(rumble_id, set()).add(queue)
    if rumble_id not in running_rumbles:
        background_tasks.add_task(run_rumble, rumble_id, queue)

    async def event_generator():
        try:
            while True:
                try:
                    event = await asyncio.wait_for(queue.get(), timeout=30.0)
                except asyncio.TimeoutError:
                    yield ": keepalive\n\n"
                    continue
                if event is None:
                    break
                yield f"event: {event['type']}\n"
                yield f"data: {json.dumps(event['data'], default=str)}\n\n"
        finally:
            active_streams.get(rumble_id, set()).discard(queue)
            if not active_streams.get(rumble_id):
                active_streams.pop(rumble_id, None)

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
