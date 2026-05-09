from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.models.ai_model import AIModel
from app.schemas.ai import AIModelsResponse

router = APIRouter()


@router.get("/models", response_model=AIModelsResponse)
async def list_models(session: AsyncSession = Depends(get_db)):
    rows = await session.scalars(select(AIModel).where(AIModel.is_active.is_(True)).order_by(AIModel.display_name))
    return {"models": rows.all()}
