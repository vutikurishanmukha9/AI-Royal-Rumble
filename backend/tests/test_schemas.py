from app.schemas.rumble import RumbleCreate


def test_rumble_create_deduplicates_selected_ais():
    payload = RumbleCreate(task="Write a launch plan", selected_ais=["gpt4o", "claude", "gpt4o"])

    assert payload.selected_ais == ["gpt4o", "claude"]
