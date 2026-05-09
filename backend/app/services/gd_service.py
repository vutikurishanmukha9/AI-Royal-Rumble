import time

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.registry import get_provider
from app.config import settings
from app.models.ai_model import AIModel
from app.models.rumble import Argument, Round, Rumble
from app.utils.prompt_builder import build_counter_prompt
from app.utils.token_counter import estimate_tokens


def select_gd_contenders(jam_results: list[dict]) -> list[dict]:
    if len(jam_results) <= 4:
        return jam_results
    return sorted(jam_results, key=lambda item: item["score"], reverse=True)[:4]


async def run_gd_round(session: AsyncSession, rumble: Rumble, jam_results: list[dict], event_queue) -> list[dict]:
    rumble.status = "gd"
    round_obj = Round(rumble_id=rumble.id, round_type="gd", round_number=2, status="active")
    session.add(round_obj)
    await session.commit()
    await session.refresh(round_obj)
    await event_queue.put({"type": "round_started", "data": {"round_type": "gd", "round_number": 2}})
    contenders = select_gd_contenders(jam_results)
    previous = jam_results.copy()
    gd_args: list[dict] = []
    phase = 1
    for _ in range(settings.max_gd_rounds):
        for index, attacker in enumerate(contenders):
            target = contenders[(index + 1) % len(contenders)]
            model = await session.scalar(select(AIModel).where(AIModel.name == attacker["ai_name"]))
            system_prompt, user_prompt = build_counter_prompt(
                model.personality,
                model.display_name,
                rumble.task,
                target["ai_name"],
                target["content"],
                previous,
            )
            provider = get_provider(attacker["ai_name"])
            await event_queue.put({"type": "gd_counter_started", "data": {"ai_name": attacker["ai_name"], "argument_type": "counter", "target_ai": target["ai_name"]}})
            started = time.perf_counter()
            chunks: list[str] = []
            async for chunk in provider.stream_response(system_prompt, user_prompt, settings.max_tokens_per_ai_gd_turn):
                chunks.append(chunk)
                await event_queue.put({"type": "ai_token", "data": {"ai_name": attacker["ai_name"], "token": chunk, "chunk": "".join(chunks)}})
            content = "".join(chunks)
            latency_ms = int((time.perf_counter() - started) * 1000)
            arg = Argument(
                rumble_id=rumble.id,
                round_id=round_obj.id,
                ai_name=attacker["ai_name"],
                argument_type="counter",
                content=content,
                target_ai=target["ai_name"],
                token_count=estimate_tokens(content),
                latency_ms=latency_ms,
                phase_order=phase,
            )
            session.add(arg)
            await session.commit()
            item = {"ai_name": attacker["ai_name"], "content": content}
            previous.append(item)
            gd_args.append(item)
            phase += 1
            await event_queue.put({"type": "ai_turn_completed", "data": {"ai_name": attacker["ai_name"], "full_content": content, "token_count": arg.token_count, "latency_ms": latency_ms}})
    round_obj.status = "completed"
    await session.commit()
    await event_queue.put({"type": "round_completed", "data": {"round_type": "gd", "round_number": 2}})
    return gd_args
