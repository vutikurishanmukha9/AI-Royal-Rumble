from app.ai.base import AIProvider
from app.ai.providers.anthropic_provider import AnthropicProvider
from app.ai.providers.deepseek_provider import DeepSeekProvider
from app.ai.providers.gemini_provider import GeminiProvider
from app.ai.providers.grok_provider import GrokProvider
from app.ai.providers.kimi_provider import KimiProvider
from app.ai.providers.llama_provider import LlamaProvider
from app.ai.providers.openai_provider import OpenAIProvider
from app.ai.providers.perplexity_provider import PerplexityProvider
from app.ai.providers.qwen_provider import QwenProvider

AI_REGISTRY: dict[str, AIProvider] = {
    "gpt4o": OpenAIProvider(),
    "claude": AnthropicProvider(),
    "gemini": GeminiProvider(),
    "grok": GrokProvider(),
    "deepseek": DeepSeekProvider(),
    "perplexity": PerplexityProvider(),
    "llama": LlamaProvider(),
    "qwen": QwenProvider(),
    "kimi": KimiProvider(),
}


def get_provider(ai_name: str) -> AIProvider:
    if ai_name not in AI_REGISTRY:
        raise ValueError(f"Unknown AI: {ai_name}")
    return AI_REGISTRY[ai_name]
