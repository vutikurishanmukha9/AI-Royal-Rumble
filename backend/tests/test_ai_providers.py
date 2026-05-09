from app.ai.registry import AI_REGISTRY, get_provider


def test_all_nine_providers_registered():
    assert set(AI_REGISTRY) == {"gpt4o", "claude", "gemini", "grok", "deepseek", "perplexity", "llama", "qwen", "kimi"}
    assert get_provider("gpt4o") is AI_REGISTRY["gpt4o"]
