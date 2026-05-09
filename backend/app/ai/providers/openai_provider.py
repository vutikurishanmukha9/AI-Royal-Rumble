from app.ai.providers.openai_compatible import OpenAICompatibleProvider
from app.config import settings


class OpenAIProvider(OpenAICompatibleProvider):
    def __init__(self) -> None:
        super().__init__("GPT-4o", "gpt-4o", settings.openai_api_key)
