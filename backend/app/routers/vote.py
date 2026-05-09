from uuid import UUID

from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from app.database import get_db
from app.routers.stream import broadcast_vote_update
from app.schemas.rumble import VoteCreate, VoteResponse
from app.services.vote_service import cast_vote

router = APIRouter()


@router.post("/rumble/{rumble_id}/vote", response_model=VoteResponse)
async def vote(rumble_id: UUID, payload: VoteCreate, request: Request, session: AsyncSession = Depends(get_db)):
    result = await cast_vote(session, str(rumble_id), payload.voted_ai, request)
    await broadcast_vote_update(str(rumble_id), result["current_votes"])
    return result
