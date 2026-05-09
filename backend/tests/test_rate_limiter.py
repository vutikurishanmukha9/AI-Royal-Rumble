from app.middleware.rate_limiter import hash_ip


def test_hash_ip_does_not_return_raw_ip():
    assert hash_ip("127.0.0.1") != "127.0.0.1"
    assert len(hash_ip("127.0.0.1")) == 32
