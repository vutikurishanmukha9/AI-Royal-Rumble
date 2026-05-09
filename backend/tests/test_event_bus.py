import json

from app.services.event_bus import parse_stream_event, stream_key


def test_stream_key_is_scoped_to_rumble():
    assert stream_key("abc") == "stream:rumble:abc"


def test_parse_stream_event_decodes_type_and_data():
    event_type, data = parse_stream_event({"type": "vote_update", "data": json.dumps({"total": 3})})

    assert event_type == "vote_update"
    assert data == {"total": 3}
