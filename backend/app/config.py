from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    database_url: str = "postgresql+asyncpg://user:password@localhost:5432/airoyalrumble"
    redis_url: str = "redis://localhost:6379/0"

    openai_api_key: str | None = None
    anthropic_api_key: str | None = None
    google_api_key: str | None = None
    xai_api_key: str | None = None
    deepseek_api_key: str | None = None
    perplexity_api_key: str | None = None
    groq_api_key: str | None = None
    alibaba_api_key: str | None = None
    moonshot_api_key: str | None = None

    app_env: str = "development"
    cors_origins: str = "http://localhost:5173"
    secret_key: str = Field(default="change-me", min_length=8)

    rate_limit_rumbles_per_ip_per_hour: int = 5
    rate_limit_votes_per_ip_per_hour: int = 20
    max_concurrent_rumbles: int = 50

    max_tokens_per_ai_jam: int = 300
    max_tokens_per_ai_gd_turn: int = 250
    max_gd_rounds: int = 3
    voting_window_seconds: int = 300

    @property
    def cors_origin_list(self) -> list[str]:
        return [origin.strip() for origin in self.cors_origins.split(",") if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
