from fastapi import HTTPException, Request
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.middleware.rate_limiter import check_rate_limit
from app.models.rumble import Rumble, Vote
from app.redis_client import get_redis
from app.services.result_service import get_vote_counts


async def cast_vote(session: AsyncSession, rumble_id: str, voted_ai: str, request: Request) -> dict:
    ip_hash = await check_rate_limit(request, "vote_cast", settings.rate_limit_votes_per_ip_per_hour)
    rumble = await session.get(Rumble, rumble_id)
    if not rumble:
        raise HTTPException(status_code=404, detail={"error": "RUMBLE_NOT_FOUND", "message": "Rumble not found", "detail": {}})
    if rumble.status != "voting":
        raise HTTPException(status_code=400, detail={"error": "RUMBLE_NOT_IN_VOTING", "message": "Voting is not open", "detail": {}})
    if voted_ai not in rumble.selected_ais:
        raise HTTPException(status_code=400, detail={"error": "INVALID_AI_SELECTION", "message": "AI is not in this rumble", "detail": {}})
    redis = await get_redis()
    vote_key = f"vote:{rumble_id}:{ip_hash}"
    if await redis.get(vote_key):
        raise HTTPException(status_code=409, detail={"error": "ALREADY_VOTED", "message": "This IP already voted", "detail": {}})
    session.add(Vote(rumble_id=rumble.id, voted_ai=voted_ai, ip_hash=ip_hash))
    try:
        await session.commit()
    except IntegrityError:
        await session.rollback()
        raise HTTPException(status_code=409, detail={"error": "ALREADY_VOTED", "message": "This IP already voted", "detail": {}})
    await redis.set(vote_key, voted_ai, ex=86400)
    counts = await get_vote_counts(session, rumble.id)
    rumble.total_votes = sum(counts.values())
    await session.commit()
    return {"success": True, "voted_ai": voted_ai, "current_votes": counts, "total_votes": sum(counts.values())}
