from app.ai.providers.openai_compatible import OpenAICompatibleProvider
from app.config import settings


class PerplexityProvider(OpenAICompatibleProvider):
    def __init__(self) -> None:
        super().__init__("Perplexity", "llama-3.1-sonar-large-128k-online", settings.perplexity_api_key, "https://api.perplexity.ai")
