from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.database import AsyncSessionLocal, init_db
from app.errors import register_error_handlers
from app.redis_client import close_redis
from app.routers import health, models, rumble, stream, vote
from app.services.model_seed import seed_ai_models


@asynccontextmanager
async def lifespan(app: FastAPI):
    if settings.auto_create_tables:
        await init_db()
    async with AsyncSessionLocal() as session:
        await seed_ai_models(session)
    yield
    await close_redis()


app = FastAPI(title="AI Royal Rumble API", version="0.1.0", lifespan=lifespan)
register_error_handlers(app)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api_prefix = "/api/v1"
app.include_router(health.router, prefix=api_prefix, tags=["health"])
app.include_router(models.router, prefix=api_prefix, tags=["models"])
app.include_router(rumble.router, prefix=api_prefix, tags=["rumble"])
app.include_router(stream.router, prefix=api_prefix, tags=["stream"])
app.include_router(vote.router, prefix=api_prefix, tags=["vote"])
