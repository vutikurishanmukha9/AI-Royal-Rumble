from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field, field_validator


class RumbleCreate(BaseModel):
    task: str = Field(min_length=3, max_length=4000)
    selected_ais: list[str] | None = None

    @field_validator("selected_ais")
    @classmethod
    def validate_ai_count(cls, value: list[str] | None) -> list[str] | None:
        if value is None:
            return value
        unique = list(dict.fromkeys(value))
        if len(unique) < 2:
            raise ValueError("TOO_FEW_AIS")
        if len(unique) > 9:
            raise ValueError("INVALID_AI_SELECTION")
        return unique


class RumbleCreateResponse(BaseModel):
    rumble_id: UUID
    task: str
    selected_ais: list[str]
    status: str
    stream_url: str


class ArgumentRead(BaseModel):
    ai_name: str
    argument_type: str
    content: str
    phase: str | None = None
    target_ai: str | None = None


class RoundRead(BaseModel):
    round_type: str
    round_number: int
    status: str
    arguments: list[ArgumentRead]


class RumbleStateResponse(BaseModel):
    rumble_id: UUID
    task: str
    status: str
    selected_ais: list[str]
    rounds: list[RoundRead]
    votes: dict[str, int]
    winner: str | None = None


class VoteCreate(BaseModel):
    voted_ai: str


class VoteResponse(BaseModel):
    success: bool
    voted_ai: str
    current_votes: dict[str, int]
    total_votes: int


class ResultsResponse(BaseModel):
    rumble_id: UUID
    task: str
    winner: str | None
    winner_display_name: str | None
    winner_tagline: str | None
    final_votes: dict[str, int]
    total_votes: int
    winner_percentage: float
    key_arguments: dict[str, str]
    completed_at: datetime | None
