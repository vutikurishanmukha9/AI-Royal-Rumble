from collections.abc import AsyncIterator

import httpx

from app.ai.base import AIProvider
from app.config import settings


class QwenProvider(AIProvider):
    async def stream_response(self, system_prompt: str, user_prompt: str, max_tokens: int = 300) -> AsyncIterator[str]:
        if not settings.alibaba_api_key:
            yield "[Qwen is unavailable: missing API key]"
            return
        payload = {
            "model": "qwen-max",
            "input": {"messages": [{"role": "system", "content": system_prompt}, {"role": "user", "content": user_prompt}]},
            "parameters": {"max_tokens": max_tokens, "incremental_output": True},
        }
        headers = {"Authorization": f"Bearer {settings.alibaba_api_key}", "X-DashScope-SSE": "enable"}
        try:
            async with httpx.AsyncClient(timeout=60) as client:
                async with client.stream(
                    "POST",
                    "https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation",
                    json=payload,
                    headers=headers,
                ) as response:
                    response.raise_for_status()
                    async for line in response.aiter_lines():
                        if '"text"' in line:
                            yield line.split('"text":', 1)[1].strip().strip('",')
        except Exception as exc:
            yield f"[Qwen encountered an issue: {str(exc)[:100]}]"

    async def health_check(self) -> bool:
        return bool(settings.alibaba_api_key)
