from datetime import UTC, datetime

from fastapi import APIRouter
from sqlalchemy import text

from app.database import AsyncSessionLocal
from app.redis_client import get_redis

router = APIRouter()


@router.get("/health")
async def health():
    database = "disconnected"
    redis_status = "disconnected"
    try:
        async with AsyncSessionLocal() as session:
            await session.execute(text("SELECT 1"))
        database = "connected"
    except Exception:
        pass
    try:
        redis = await get_redis()
        await redis.ping()
        redis_status = "connected"
    except Exception:
        pass
    return {"status": "ok" if database == "connected" and redis_status == "connected" else "degraded", "database": database, "redis": redis_status, "timestamp": datetime.now(UTC)}
