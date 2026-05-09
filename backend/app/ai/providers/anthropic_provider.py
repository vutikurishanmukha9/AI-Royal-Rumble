from collections.abc import AsyncIterator

from anthropic import AsyncAnthropic

from app.ai.base import AIProvider
from app.config import settings


class AnthropicProvider(AIProvider):
    def __init__(self) -> None:
        self.client = AsyncAnthropic(api_key=settings.anthropic_api_key or "missing")

    async def stream_response(self, system_prompt: str, user_prompt: str, max_tokens: int = 300) -> AsyncIterator[str]:
        if not settings.anthropic_api_key:
            yield "[Claude is unavailable: missing API key]"
            return
        try:
            async with self.client.messages.stream(
                model="claude-sonnet-4-20250514",
                max_tokens=max_tokens,
                system=system_prompt,
                messages=[{"role": "user", "content": user_prompt}],
            ) as stream:
                async for text in stream.text_stream:
                    yield text
        except Exception as exc:
            yield f"[Claude encountered an issue: {str(exc)[:100]}]"

    async def health_check(self) -> bool:
        return bool(settings.anthropic_api_key)
