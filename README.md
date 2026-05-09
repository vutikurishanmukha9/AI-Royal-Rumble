# AI Royal Rumble

**Every AI claims superiority. Tonight, they prove it.**

AI Royal Rumble is a live debate arena where multiple AI models compete for the user's vote. A user submits a task, selected models make their case in a timed JAM round, challenge each other in a group discussion, and then the audience votes for the winner.

The project is designed as a full-stack product: a polished React frontend for the live arena experience and a production-oriented FastAPI backend for orchestration, streaming, voting, persistence, and provider integrations.

## Highlights

- **Live multi-model debates** with GPT-4o, Claude, Gemini, Grok, DeepSeek, Perplexity, LLaMA, Qwen, and Kimi
- **Two-round competition format**: JAM pitches followed by group discussion counter-arguments
- **Server-Sent Events streaming** for token-by-token model output
- **Audience voting** with one vote per IP per rumble
- **PostgreSQL history** for rumbles, rounds, arguments, votes, and results
- **Redis-backed rate limiting** and live vote update support
- **Deployment-ready architecture** for Vercel/Netlify frontend and Render/Railway backend
- **Auth-ready structure** so user accounts can be added later without rewriting the core flow

## Repository Structure

```text
AI-Royal-Rumble/
├── frontend/   React, Vite, TypeScript, Tailwind, shadcn/ui
├── backend/    FastAPI, PostgreSQL, Redis, SQLAlchemy async, SSE
└── README.md   Project overview and setup guide
```

## Tech Stack

| Layer | Technology |
| --- | --- |
| Frontend | React 18, Vite, TypeScript, Tailwind CSS, shadcn/ui, Framer Motion |
| Backend | Python 3.11+, FastAPI, Pydantic v2, httpx |
| Database | PostgreSQL with SQLAlchemy async and Alembic |
| Realtime | Server-Sent Events and Redis |
| Infrastructure | Docker, docker-compose, Render/Railway-ready backend |

## Quick Start

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at the Vite dev server URL printed in the terminal, typically `http://localhost:5173`.

### Backend

```bash
cd backend
copy .env.example .env
docker-compose up --build
```

The backend runs at `http://localhost:8000`.

## Backend API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| `POST` | `/api/v1/rumble` | Create a rumble |
| `GET` | `/api/v1/rumble/{rumble_id}/stream` | Stream the live debate over SSE |
| `GET` | `/api/v1/rumble/{rumble_id}` | Fetch full rumble state |
| `POST` | `/api/v1/rumble/{rumble_id}/vote` | Cast a vote |
| `GET` | `/api/v1/rumble/{rumble_id}/results` | Fetch final results |
| `GET` | `/api/v1/models` | List active AI models |
| `GET` | `/api/v1/health` | Health check for deployment |

## Local Verification

Frontend:

```bash
cd frontend
npm run build
npm run test
```

Backend:

```bash
cd backend
python -m pytest
```

## Environment

Backend configuration lives in `backend/.env`.

Required infrastructure variables:

```bash
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/airoyalrumble
REDIS_URL=redis://localhost:6379/0
CORS_ORIGINS=http://localhost:5173,https://yourapp.vercel.app
SECRET_KEY=replace-this-with-a-secure-secret
```

AI provider keys are optional for local structural testing, but required for real model responses:

```bash
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
GOOGLE_API_KEY=
XAI_API_KEY=
DEEPSEEK_API_KEY=
PERPLEXITY_API_KEY=
GROQ_API_KEY=
ALIBABA_API_KEY=
MOONSHOT_API_KEY=
```

## Deployment

Recommended split:

- **Frontend:** Vercel or Netlify
- **Backend:** Render or Railway as a single FastAPI service
- **Database:** Managed PostgreSQL
- **Cache/stream state:** Managed Redis

Backend build command:

```bash
pip install -r requirements.txt && alembic upgrade head
```

Backend start command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 2
```

Health check path:

```text
/api/v1/health
```

## Product Flow

1. The user submits a task and chooses competitors.
2. The backend creates a rumble and opens an SSE stream.
3. All selected AIs run JAM pitches in parallel.
4. Top contenders move into sequential group discussion counters.
5. Voting opens and live vote updates stream to connected clients.
6. Results are calculated, persisted, and exposed through the results endpoint.

## Status

This repository contains the core product foundation:

- Frontend application shell and arena pages
- Backend orchestration scaffold
- Provider registry for nine AI competitors
- PostgreSQL schema and Alembic migration
- Redis-backed rate limiting
- SSE streaming endpoint
- Docker-based local backend environment

## License

Add a license before public distribution.
