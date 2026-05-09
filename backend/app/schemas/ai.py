from pydantic import BaseModel, ConfigDict


class AIModelRead(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    name: str
    display_name: str
    tagline: str
    personality: str
    is_active: bool


class AIModelsResponse(BaseModel):
    models: list[AIModelRead]
