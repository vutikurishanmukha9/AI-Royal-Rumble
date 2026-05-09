from app.ai.models_seed import AI_MODELS
from app.services.gd_service import select_gd_contenders


def test_seed_contains_nine_models():
    assert len(AI_MODELS) == 9
    assert {item["name"] for item in AI_MODELS}


def test_gd_contenders_take_top_four_by_score():
    results = [{"ai_name": f"ai-{index}", "score": index, "content": "x"} for index in range(6)]

    contenders = select_gd_contenders(results)

    assert [item["ai_name"] for item in contenders] == ["ai-5", "ai-4", "ai-3", "ai-2"]
