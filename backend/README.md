# AI Royal Rumble Backend

FastAPI backend for AI Royal Rumble: users submit a task, multiple AI providers stream live JAM and Group Discussion rounds over Server-Sent Events (SSE), then users vote for the winner.

## Local Development

1. Copy `.env.example` to `.env` and fill in at least two AI provider API keys.
2. Start Postgres, Redis, and the API:

```bash
docker-compose up --build
```

The API runs at `http://localhost:8000`.

## API Endpoints

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/v1/rumble` | Create a new rumble |
| `GET` | `/api/v1/rumble/{id}/stream` | SSE stream (real-time events) |
| `GET` | `/api/v1/rumble/{id}` | Get full rumble state |
| `POST` | `/api/v1/rumble/{id}/vote` | Cast a vote |
| `GET` | `/api/v1/rumble/{id}/results` | Final results |
| `GET` | `/api/v1/models` | List active AI models |
| `GET` | `/api/v1/health` | Health check (DB + Redis) |

## Deployment Files

This directory contains config files for multiple deployment targets:

| File | Platform | Purpose |
|---|---|---|
| `render.yaml` | **Render** | Blueprint — auto-provisions web service + Postgres + Redis |
| `railway.toml` | **Railway** | Build + deploy config (TOML format) |
| `railway.json` | **Railway** | Build + deploy config (JSON format) |
| `nixpacks.toml` | **Railway** | Nixpacks build system config |
| `Procfile` | **Any** | Universal process declaration (Render/Railway/Heroku) |
| `runtime.txt` | **Any** | Python version pin |
| `Dockerfile` | **Any** | Docker container build |
| `docker-compose.yml` | **Local** | Full dev stack (API + Postgres + Redis) |

### Deploy to Render

**One-click Blueprint:**
1. Dashboard → New → Blueprint → connect repo → root directory: `backend`
2. Render reads `render.yaml` and provisions everything
3. Set your AI provider API keys + `CORS_ORIGINS` in the Environment tab

**Manual setup:**
- Build Command: `pip install -r requirements.txt && alembic upgrade head`
- Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 2`
- Health Check: `/api/v1/health`

### Deploy to Railway

1. New Project → add PostgreSQL + Redis plugins
2. Add service from GitHub → root directory: `backend`
3. Railway auto-reads `railway.toml`
4. Link DB/Redis plugins via Shared Variables
5. Set your AI provider API keys + `CORS_ORIGINS` in Variables tab

### Important Notes

- **DB URL auto-transform**: The backend automatically handles database URL format transformations between cloud database providers and async pg drivers transparently.
- **SSE buffering**: The `X-Accel-Buffering: no` header is set on the stream endpoint to prevent proxy buffering. `PYTHONUNBUFFERED=1` is set in the Dockerfile.
- **Missing API keys**: AI models without active API keys are gracefully marked inactive on startup, allowing the backend to remain fully operational with whatever keys are provided.
- **CORS**: Ensure `CORS_ORIGINS` is configured with your deployed frontend URL.

## Future Auth Integration

Auth can be added additively by introducing optional user dependencies on rumble creation and voting, then adding nullable `user_id` foreign keys to `rumbles` and `votes`.
