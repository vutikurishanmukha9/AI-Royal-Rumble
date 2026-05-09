# AI Royal Rumble Backend

FastAPI backend for AI Royal Rumble: users submit a task, multiple AI providers stream live JAM and Group Discussion rounds over SSE, then users vote for the winner.

## Local development

1. Copy `.env.example` to `.env` and fill in API keys as needed.
2. Start Postgres, Redis, and the API:

```bash
docker-compose up --build
```

The API runs at `http://localhost:8000`.

## Key endpoints

- `POST /api/v1/rumble`
- `GET /api/v1/rumble/{rumble_id}/stream`
- `GET /api/v1/rumble/{rumble_id}`
- `POST /api/v1/rumble/{rumble_id}/vote`
- `GET /api/v1/rumble/{rumble_id}/results`
- `GET /api/v1/models`
- `GET /api/v1/health`

## Deployment

Render/Railway build command:

```bash
pip install -r requirements.txt && alembic upgrade head
```

Start command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 2
```

Health check path: `/api/v1/health`.

## Future auth integration

Auth can be added additively by introducing optional user dependencies on rumble creation and voting, then adding nullable `user_id` foreign keys to `rumbles` and `votes`.
