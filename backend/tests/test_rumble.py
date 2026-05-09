from app.ai.models_seed import AI_MODELS


def test_seed_contains_nine_models():
    assert len(AI_MODELS) == 9
    assert {item["name"] for item in AI_MODELS}
