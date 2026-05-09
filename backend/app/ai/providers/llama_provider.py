from collections.abc import AsyncIterator

from groq import AsyncGroq

from app.ai.base import AIProvider
from app.config import settings


class LlamaProvider(AIProvider):
    def __init__(self) -> None:
        self.client = AsyncGroq(api_key=settings.groq_api_key or "missing")

    async def stream_response(self, system_prompt: str, user_prompt: str, max_tokens: int = 300) -> AsyncIterator[str]:
        if not settings.groq_api_key:
            yield "[LLaMA is unavailable: missing API key]"
            return
        try:
            stream = await self.client.chat.completions.create(
                model="llama-3.1-70b-versatile",
                messages=[{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}],
                max_tokens=max_tokens,
                stream=True,
            )
            async for chunk in stream:
                token = chunk.choices[0].delta.content
                if token:
                    yield token
        except Exception as exc:
            yield f"[LLaMA encountered an issue: {str(exc)[:100]}]"

    async def health_check(self) -> bool:
        return bool(settings.groq_api_key)
