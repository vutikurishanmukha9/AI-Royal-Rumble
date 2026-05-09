from collections.abc import AsyncIterator

from openai import AsyncOpenAI

from app.ai.base import AIProvider


class OpenAICompatibleProvider(AIProvider):
    def __init__(
        self,
        display_name: str,
        model: str,
        api_key: str | None,
        base_url: str | None = None,
    ) -> None:
        self.display_name = display_name
        self.model = model
        self.api_key = api_key
        self.client = AsyncOpenAI(api_key=api_key or "missing", base_url=base_url)

    async def stream_response(
        self, system_prompt: str, user_prompt: str, max_tokens: int = 300
    ) -> AsyncIterator[str]:
        if not self.api_key:
            yield f"[{self.display_name} is unavailable: missing API key]"
            return
        try:
            stream = await self.client.chat.completions.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                max_tokens=max_tokens,
                stream=True,
            )
            async for chunk in stream:
                token = chunk.choices[0].delta.content
                if token:
                    yield token
        except Exception as exc:
            yield f"[{self.display_name} encountered an issue: {str(exc)[:100]}]"

    async def health_check(self) -> bool:
        if not self.api_key:
            return False
        try:
            await self.client.models.list()
            return True
        except Exception:
            return False
