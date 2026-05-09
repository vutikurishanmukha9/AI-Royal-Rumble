import asyncio
import time

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.registry import get_provider
from app.config import settings
from app.models.ai_model import AIModel
from app.models.rumble import Argument, Round, Rumble
from app.utils.prompt_builder import build_jam_prompt
from app.utils.token_counter import estimate_tokens


async def run_jam_turn(session_factory, rumble_id, round_id, ai_name: str, event_queue: asyncio.Queue, phase_order: int) -> dict:
    async with session_factory() as session:
        rumble = await session.get(Rumble, rumble_id)
        model = await session.scalar(select(AIModel).where(AIModel.name == ai_name))
        provider = get_provider(ai_name)
        system_prompt, user_prompt = build_jam_prompt(model.personality, model.display_name, rumble.task)
        started = time.perf_counter()
        chunks: list[str] = []
        await event_queue.put({"type": "ai_turn_started", "data": {"ai_name": ai_name, "argument_type": "pitch", "phase": "Opening"}})
        async for chunk in provider.stream_response(system_prompt, user_prompt, settings.max_tokens_per_ai_jam):
            chunks.append(chunk)
            await event_queue.put({"type": "ai_token", "data": {"ai_name": ai_name, "token": chunk, "chunk": "".join(chunks)}})
        content = "".join(chunks)
        latency_ms = int((time.perf_counter() - started) * 1000)
        arg = Argument(
            rumble_id=rumble_id,
            round_id=round_id,
            ai_name=ai_name,
            argument_type="pitch",
            content=content,
            token_count=estimate_tokens(content),
            latency_ms=latency_ms,
            phase_order=phase_order,
        )
        session.add(arg)
        await session.commit()
        data = {"ai_name": ai_name, "full_content": content, "token_count": arg.token_count, "latency_ms": latency_ms}
        await event_queue.put({"type": "ai_turn_completed", "data": data})
        return {"ai_name": ai_name, "content": content, "score": len(content)}


async def run_jam_round(session: AsyncSession, session_factory, rumble: Rumble, event_queue: asyncio.Queue) -> list[dict]:
    rumble.status = "jam"
    round_obj = Round(rumble_id=rumble.id, round_type="jam", round_number=1, status="active")
    session.add(round_obj)
    await session.commit()
    await session.refresh(round_obj)
    await event_queue.put({"type": "round_started", "data": {"round_type": "jam", "round_number": 1}})
    results = await asyncio.gather(
        *(run_jam_turn(session_factory, rumble.id, round_obj.id, ai, event_queue, idx) for idx, ai in enumerate(rumble.selected_ais, 1)),
        return_exceptions=True,
    )
    round_obj.status = "completed"
    await session.commit()
    await event_queue.put({"type": "round_completed", "data": {"round_type": "jam", "round_number": 1}})
    return [item for item in results if isinstance(item, dict)]
