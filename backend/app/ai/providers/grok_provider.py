from app.ai.providers.openai_compatible import OpenAICompatibleProvider
from app.config import settings


class GrokProvider(OpenAICompatibleProvider):
    def __init__(self) -> None:
        super().__init__("Grok", "grok-2-latest", settings.xai_api_key, "https://api.x.ai/v1")
