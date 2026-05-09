from app.ai.providers.openai_compatible import OpenAICompatibleProvider
from app.config import settings


class KimiProvider(OpenAICompatibleProvider):
    def __init__(self) -> None:
        super().__init__("Kimi", "moonshot-v1-8k", settings.moonshot_api_key, "https://api.moonshot.cn/v1")
