import asyncio
import uuid

from app.config import settings
from app.database import AsyncSessionLocal
from app.models.rumble import Rumble
from app.redis_client import get_redis
from app.services.event_bus import publish_event
from app.services.gd_service import run_gd_round
from app.services.jam_service import run_jam_round
from app.services.result_service import complete_rumble, get_vote_counts

running_rumbles: set[str] = set()
rumble_tasks: dict[str, asyncio.Task] = {}


def start_rumble_task(rumble_id: str) -> None:
    if rumble_id in rumble_tasks and not rumble_tasks[rumble_id].done():
        return
    task = asyncio.create_task(run_rumble(rumble_id))
    rumble_tasks[rumble_id] = task
    task.add_done_callback(lambda _: rumble_tasks.pop(rumble_id, None))


async def _release_lock(lock_key: str, token: str) -> None:
    redis = await get_redis()
    if await redis.get(lock_key) == token:
        await redis.delete(lock_key)


async def run_rumble(rumble_id: str) -> None:
    if rumble_id in running_rumbles:
        return
    redis = await get_redis()
    lock_key = f"lock:rumble:{rumble_id}"
    lock_token = str(uuid.uuid4())
    acquired = await redis.set(lock_key, lock_token, nx=True, ex=settings.rumble_lock_ttl_seconds)
    if not acquired:
        return
    running_rumbles.add(rumble_id)
    try:
        async with AsyncSessionLocal() as session:
            rumble = await session.get(Rumble, rumble_id)
            if not rumble:
                await publish_event(rumble_id, "error", {"code": "RUMBLE_NOT_FOUND", "message": "Rumble not found"})
                return
            if rumble.status == "completed":
                return
            await publish_event(rumble_id, "rumble_started", {"rumble_id": str(rumble.id), "task": rumble.task, "ais": rumble.selected_ais})
            jam_results = await run_jam_round(session, AsyncSessionLocal, rumble)
            successful_ais = [item["ai_name"] for item in jam_results]
            rumble.selected_ais = successful_ais
            await session.commit()
            if len(jam_results) >= 2:
                await run_gd_round(session, rumble, jam_results)
            elif not jam_results:
                rumble.status = "completed"
                await session.commit()
                await publish_event(
                    rumble_id,
                    "error",
                    {"code": "AI_UNAVAILABLE", "message": "No AI providers completed the JAM round"},
                )
                return
            rumble.status = "voting"
            await session.commit()
            await publish_event(rumble_id, "voting_open", {"rumble_id": str(rumble.id), "ais": rumble.selected_ais})
            await asyncio.sleep(settings.voting_window_seconds)
            await complete_rumble(session, rumble)
            counts = await get_vote_counts(session, rumble.id)
            await publish_event(rumble_id, "rumble_completed", {"winner": rumble.winner_ai, "final_votes": counts, "rumble_id": str(rumble.id)})
    except Exception as exc:
        await publish_event(rumble_id, "error", {"code": "ORCHESTRATION_ERROR", "message": str(exc)[:200]})
    finally:
        running_rumbles.discard(rumble_id)
        await _release_lock(lock_key, lock_token)
