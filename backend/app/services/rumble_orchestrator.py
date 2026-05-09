import asyncio
from datetime import UTC, datetime

from sqlalchemy.ext.asyncio import async_sessionmaker

from app.config import settings
from app.database import AsyncSessionLocal
from app.models.rumble import Rumble
from app.services.gd_service import run_gd_round
from app.services.jam_service import run_jam_round
from app.services.result_service import complete_rumble, get_vote_counts

running_rumbles: set[str] = set()


async def run_rumble(rumble_id: str, event_queue: asyncio.Queue) -> None:
    if rumble_id in running_rumbles:
        return
    running_rumbles.add(rumble_id)
    try:
        async with AsyncSessionLocal() as session:
            rumble = await session.get(Rumble, rumble_id)
            if not rumble:
                await event_queue.put({"type": "error", "data": {"code": "RUMBLE_NOT_FOUND", "message": "Rumble not found"}})
                return
            await event_queue.put({"type": "rumble_started", "data": {"rumble_id": str(rumble.id), "task": rumble.task, "ais": rumble.selected_ais}})
            jam_results = await run_jam_round(session, AsyncSessionLocal, rumble, event_queue)
            await run_gd_round(session, rumble, jam_results, event_queue)
            rumble.status = "voting"
            await session.commit()
            await event_queue.put({"type": "voting_open", "data": {"rumble_id": str(rumble.id), "ais": rumble.selected_ais}})
            await asyncio.sleep(settings.voting_window_seconds)
            await complete_rumble(session, rumble)
            counts = await get_vote_counts(session, rumble.id)
            rumble.completed_at = datetime.now(UTC)
            await session.commit()
            await event_queue.put({"type": "rumble_completed", "data": {"winner": rumble.winner_ai, "final_votes": counts, "rumble_id": str(rumble.id)}})
    except Exception as exc:
        await event_queue.put({"type": "error", "data": {"code": "ORCHESTRATION_ERROR", "message": str(exc)[:200]}})
    finally:
        running_rumbles.discard(rumble_id)
        await event_queue.put(None)
