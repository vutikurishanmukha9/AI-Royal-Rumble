from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.ai.models_seed import AI_MODELS
from app.models.ai_model import AIModel


async def seed_ai_models(session: AsyncSession) -> None:
    for item in AI_MODELS:
        existing = await session.scalar(select(AIModel).where(AIModel.name == item["name"]))
        if existing:
            for key, value in item.items():
                setattr(existing, key, value)
        else:
            session.add(AIModel(**item))
    await session.commit()
