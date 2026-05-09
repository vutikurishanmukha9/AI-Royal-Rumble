import asyncio
import time

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.registry import get_provider
from app.config import settings
from app.models.ai_model import AIModel
from app.models.rumble import Argument, Round, Rumble
from app.services.event_bus import publish_event
from app.utils.prompt_builder import build_jam_prompt
from app.utils.token_counter import estimate_tokens


def _looks_like_provider_failure(content: str) -> bool:
    lowered = content.lower()
    return content.startswith("[") and ("unavailable" in lowered or "encountered an issue" in lowered)


async def run_jam_turn(session_factory, rumble_id, round_id, ai_name: str, phase_order: int) -> dict:
    async with session_factory() as session:
        try:
            rumble = await session.get(Rumble, rumble_id)
            model = await session.scalar(select(AIModel).where(AIModel.name == ai_name))
            if not rumble or not model:
                raise ValueError("Missing rumble or model metadata")
            provider = get_provider(ai_name)
            system_prompt, user_prompt = build_jam_prompt(model.personality, model.display_name, rumble.task)
            started = time.perf_counter()
            chunks: list[str] = []
            await publish_event(str(rumble_id), "ai_turn_started", {"ai_name": ai_name, "argument_type": "pitch", "phase": "Opening"})
            async for chunk in provider.stream_response(system_prompt, user_prompt, settings.max_tokens_per_ai_jam):
                chunks.append(chunk)
                await publish_event(str(rumble_id), "ai_token", {"ai_name": ai_name, "token": chunk, "chunk": "".join(chunks)})
            content = "".join(chunks).strip()
            if _looks_like_provider_failure(content):
                await publish_event(str(rumble_id), "error", {"code": "AI_UNAVAILABLE", "ai_name": ai_name, "message": content.strip("[]")})
                return {"ai_name": ai_name, "failed": True, "content": content, "score": 0}
            latency_ms = int((time.perf_counter() - started) * 1000)
            token_count = estimate_tokens(content)
            arg = Argument(
                rumble_id=rumble_id,
                round_id=round_id,
                ai_name=ai_name,
                argument_type="pitch",
                content=content,
                token_count=token_count,
                latency_ms=latency_ms,
                phase_order=phase_order,
            )
            session.add(arg)
            await session.commit()
            data = {"ai_name": ai_name, "full_content": content, "token_count": token_count, "latency_ms": latency_ms}
            await publish_event(str(rumble_id), "ai_turn_completed", data)
            return {"ai_name": ai_name, "content": content, "score": len(content), "failed": False}
        except Exception as exc:
            await publish_event(str(rumble_id), "error", {"code": "AI_UNAVAILABLE", "ai_name": ai_name, "message": str(exc)[:200]})
            return {"ai_name": ai_name, "failed": True, "content": "", "score": 0}


async def run_jam_round(session: AsyncSession, session_factory, rumble: Rumble) -> list[dict]:
    rumble.status = "jam"
    round_obj = Round(rumble_id=rumble.id, round_type="jam", round_number=1, status="active")
    session.add(round_obj)
    await session.commit()
    await session.refresh(round_obj)
    await publish_event(str(rumble.id), "round_started", {"round_type": "jam", "round_number": 1})
    results = await asyncio.gather(
        *(run_jam_turn(session_factory, rumble.id, round_obj.id, ai, idx) for idx, ai in enumerate(rumble.selected_ais, 1)),
        return_exceptions=True,
    )
    round_obj.status = "completed"
    await session.commit()
    await publish_event(str(rumble.id), "round_completed", {"round_type": "jam", "round_number": 1})
    return [item for item in results if isinstance(item, dict) and not item.get("failed")]
