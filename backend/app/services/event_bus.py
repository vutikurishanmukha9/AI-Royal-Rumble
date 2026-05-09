import json
from typing import Any

from app.config import settings
from app.redis_client import get_redis


def stream_key(rumble_id: str) -> str:
    return f"stream:rumble:{rumble_id}"


async def publish_event(rumble_id: str, event_type: str, data: dict[str, Any]) -> str:
    redis = await get_redis()
    event_id = await redis.xadd(
        stream_key(str(rumble_id)),
        {"type": event_type, "data": json.dumps(data, default=str)},
        maxlen=settings.stream_buffer_max_events,
        approximate=True,
    )
    return str(event_id)


def parse_stream_event(fields: dict[str, str]) -> tuple[str, dict[str, Any]]:
    event_type = fields.get("type", "message")
    raw_data = fields.get("data", "{}")
    return event_type, json.loads(raw_data)
