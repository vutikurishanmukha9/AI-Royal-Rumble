import hashlib

from fastapi import HTTPException, Request

from app.config import settings
from app.redis_client import get_redis


def hash_ip(ip: str) -> str:
    return hashlib.sha256(f"{settings.secret_key}:{ip}".encode()).hexdigest()[:32]


def get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


async def check_rate_limit(request: Request, action: str, limit: int, window_seconds: int = 3600) -> str:
    ip_hash = hash_ip(get_client_ip(request))
    key = f"rate:{action}:{ip_hash}"
    redis = await get_redis()
    current = await redis.incr(key)
    if current == 1:
        await redis.expire(key, window_seconds)
    if current > limit:
        ttl = await redis.ttl(key)
        raise HTTPException(
            status_code=429,
            detail={
                "error": "RATE_LIMIT_EXCEEDED",
                "message": f"Too many {action} requests. Please wait.",
                "retry_after": ttl,
            },
        )
    return ip_hash
