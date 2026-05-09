from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.ai.models_seed import AI_MODELS
from app.config import settings
from app.database import get_db
from app.middleware.rate_limiter import check_rate_limit
from app.models.ai_model import AIModel
from app.models.rumble import Rumble, Vote
from app.schemas.rumble import ResultsResponse, RumbleCreate, RumbleCreateResponse, RumbleStateResponse
from app.services.result_service import build_results, get_vote_counts

router = APIRouter()


@router.post("/rumble", response_model=RumbleCreateResponse)
async def create_rumble(payload: RumbleCreate, request: Request, session: AsyncSession = Depends(get_db)):
    ip_hash = await check_rate_limit(request, "rumble_create", settings.rate_limit_rumbles_per_ip_per_hour)
    active_names = [item["name"] for item in AI_MODELS]
    selected = payload.selected_ais or active_names
    unknown = sorted(set(selected) - set(active_names))
    if unknown:
        raise HTTPException(status_code=400, detail={"error": "INVALID_AI_SELECTION", "message": f"Unknown AI(s): {', '.join(unknown)}", "detail": {}})
    if len(selected) < 2:
        raise HTTPException(status_code=400, detail={"error": "TOO_FEW_AIS", "message": "Select at least 2 AIs", "detail": {}})
    rumble = Rumble(task=payload.task, selected_ais=selected, ip_hash=ip_hash, status="created")
    session.add(rumble)
    await session.commit()
    await session.refresh(rumble)
    return RumbleCreateResponse(
        rumble_id=rumble.id,
        task=rumble.task,
        selected_ais=rumble.selected_ais,
        status=rumble.status,
        stream_url=f"/api/v1/rumble/{rumble.id}/stream",
    )


@router.get("/rumble/{rumble_id}", response_model=RumbleStateResponse)
async def get_rumble(rumble_id: str, session: AsyncSession = Depends(get_db)):
    result = await session.execute(
        select(Rumble).where(Rumble.id == rumble_id).options(selectinload(Rumble.rounds).selectinload("*"))
    )
    rumble = result.scalar_one_or_none()
    if not rumble:
        raise HTTPException(status_code=404, detail={"error": "RUMBLE_NOT_FOUND", "message": "Rumble not found", "detail": {}})
    votes = await get_vote_counts(session, rumble.id)
    rounds = []
    for round_obj in sorted(rumble.rounds, key=lambda item: item.round_number):
        rounds.append(
            {
                "round_type": round_obj.round_type,
                "round_number": round_obj.round_number,
                "status": round_obj.status,
                "arguments": [
                    {
                        "ai_name": arg.ai_name,
                        "argument_type": arg.argument_type,
                        "content": arg.content,
                        "phase": "Opening" if arg.argument_type == "pitch" else "Counter",
                        "target_ai": arg.target_ai,
                    }
                    for arg in sorted(round_obj.arguments, key=lambda item: item.phase_order or 0)
                ],
            }
        )
    return {"rumble_id": rumble.id, "task": rumble.task, "status": rumble.status, "selected_ais": rumble.selected_ais, "rounds": rounds, "votes": votes, "winner": rumble.winner_ai}


@router.get("/rumble/{rumble_id}/results", response_model=ResultsResponse)
async def get_results(rumble_id: str, session: AsyncSession = Depends(get_db)):
    rumble = await session.get(Rumble, rumble_id)
    if not rumble:
        raise HTTPException(status_code=404, detail={"error": "RUMBLE_NOT_FOUND", "message": "Rumble not found", "detail": {}})
    return await build_results(session, rumble)
