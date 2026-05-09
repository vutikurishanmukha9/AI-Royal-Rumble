from app.ai.providers.openai_compatible import OpenAICompatibleProvider
from app.config import settings


class DeepSeekProvider(OpenAICompatibleProvider):
    def __init__(self) -> None:
        super().__init__("DeepSeek", "deepseek-chat", settings.deepseek_api_key, "https://api.deepseek.com/v1")
