from collections.abc import AsyncIterator

import httpx

from app.ai.base import AIProvider
from app.config import settings


class GeminiProvider(AIProvider):
    async def stream_response(self, system_prompt: str, user_prompt: str, max_tokens: int = 300) -> AsyncIterator[str]:
        if not settings.google_api_key:
            yield "[Gemini is unavailable: missing API key]"
            return
        url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:streamGenerateContent"
        params = {"key": settings.google_api_key, "alt": "sse"}
        payload = {
            "systemInstruction": {"parts": [{"text": system_prompt}]},
            "contents": [{"role": "user", "parts": [{"text": user_prompt}]}],
            "generationConfig": {"maxOutputTokens": max_tokens},
        }
        try:
            async with httpx.AsyncClient(timeout=60) as client:
                async with client.stream("POST", url, params=params, json=payload) as response:
                    response.raise_for_status()
                    async for line in response.aiter_lines():
                        if '"text"' in line:
                            yield line.split('"text":', 1)[1].strip().strip('",')
        except Exception as exc:
            yield f"[Gemini encountered an issue: {str(exc)[:100]}]"

    async def health_check(self) -> bool:
        return bool(settings.google_api_key)
