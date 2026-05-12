# AI Royal Rumble

**Every AI claims superiority. Tonight, they prove it.**

AI Royal Rumble is a full-stack live debate platform where multiple AI models compete for a user's vote. A user submits a task, chooses the competing models, watches each model argue its case in real time, and then votes for the model that delivered the strongest response.

The product combines a cinematic frontend experience with a production-oriented backend built for asynchronous orchestration, token streaming, vote handling, persistence, and deployment on modern cloud platforms.

## Table of Contents

- [Overview](#overview)
- [Core Experience](#core-experience)
- [Architecture](#architecture)
- [Repository Structure](#repository-structure)
- [Technology Stack](#technology-stack)
- [Backend Capabilities](#backend-capabilities)
- [Frontend Capabilities](#frontend-capabilities)
- [Local Development](#local-development)
- [Backend API Reference](#backend-api-reference)
- [Realtime Streaming Model](#realtime-streaming-model)
- [Database Model](#database-model)
- [Environment Configuration](#environment-configuration)
- [Testing and Verification](#testing-and-verification)
- [Deployment](#deployment)
- [Production Readiness Notes](#production-readiness-notes)
- [Future Roadmap](#future-roadmap)
- [Project Status](#project-status)

## Overview

AI Royal Rumble turns AI model comparison into a live arena format. Instead of asking one model for an answer and manually comparing outputs, the platform makes models compete in a structured debate.

The application is built around three product ideas:

1. **Competition:** Multiple AI models respond to the same task under the same rules.
2. **Live Spectatorship:** Responses stream in real time so the experience feels like a broadcast, not a static benchmark.
3. **Human Judgment:** The user decides the winner based on persuasion, usefulness, clarity, and fit for the task.

This makes AI Royal Rumble useful as both an entertaining product and a practical model-comparison interface.

## Core Experience

The default rumble flow has two debate rounds followed by voting.

### 1. Rumble Creation

The user submits a task, such as:

```text
Write a cover letter for a senior frontend engineering role.
```

The user may select specific competitors or allow the system to use all active models.

### 2. JAM Round

Every selected model gets an opening turn. These responses run in parallel, and each model argues why it is best suited for the submitted task.

The JAM round is designed to feel fast, competitive, and high-signal.

### 3. Group Discussion Round

The strongest contenders move into a structured counter-argument round. Each model responds to another model's previous argument and tries to expose weaknesses while strengthening its own case.

This round is sequential because each response depends on prior debate context.

### 4. Voting

After the debate, voting opens. The user votes for the AI that made the strongest case. Vote updates can be streamed live to connected clients.

### 5. Results

The backend calculates the winner, stores the result, and exposes final vote totals and key arguments through the results endpoint.

## Architecture

AI Royal Rumble is organized as a two-application monorepo:

- **Frontend:** A React/Vite application responsible for the user interface, arena screens, routing, visual presentation, and client-side interaction.
- **Backend:** A FastAPI service responsible for rumble creation, orchestration, model routing, streaming, voting, persistence, and health checks.

The backend uses PostgreSQL as the durable system of record and Redis for realtime coordination, rate limiting, locking, and stream buffering.

```text
User
  |
  v
Frontend: React + Vite
  |
  | REST + SSE
  v
Backend: FastAPI
  |
  | Async orchestration
  v
AI Provider Registry
  |
  +--> Model provider adapters
  |
  +--> Redis Streams for realtime events
  |
  +--> PostgreSQL for durable history
```

## Repository Structure

```text
AI-Royal-Rumble/
|-- frontend/
|   |-- src/
|   |   |-- components/
|   |   |-- pages/
|   |   |-- hooks/
|   |   |-- data/
|   |   `-- lib/
|   |-- public/
|   |-- package.json
|   |-- vite.config.ts
|   `-- tailwind.config.ts
|
|-- backend/
|   |-- app/
|   |   |-- ai/
|   |   |-- middleware/
|   |   |-- models/
|   |   |-- routers/
|   |   |-- schemas/
|   |   |-- services/
|   |   `-- utils/
|   |-- alembic/
|   |-- tests/
|   |-- Dockerfile
|   |-- docker-compose.yml
|   |-- requirements.txt
|   `-- README.md
|
|-- README.md
`-- .gitignore
```

## Technology Stack

| Area | Technology | Purpose |
| --- | --- | --- |
| Frontend framework | React 18 | Component-driven UI |
| Build tool | Vite | Fast local development and production builds |
| Language | TypeScript | Safer frontend development |
| Styling | Tailwind CSS | Utility-first styling |
| UI primitives | shadcn/ui, Radix UI | Accessible interface components |
| Animation | Framer Motion | Motion and interaction polish |
| Backend framework | FastAPI | Async API service |
| Backend language | Python 3.11+ | Service logic and orchestration |
| Data validation | Pydantic v2 | Request and response schemas |
| Database | PostgreSQL | Durable rumble history |
| ORM | SQLAlchemy async | Async database access |
| Migrations | Alembic | Database schema evolution |
| Cache/realtime | Redis | Rate limiting, locks, stream buffering |
| Realtime transport | Server-Sent Events | Token-by-token streaming |
| HTTP client | httpx | Async provider communication |
| Local infrastructure | Docker Compose | Local Postgres, Redis, and API service |

## Backend Capabilities

The backend is designed around clear service boundaries and production-oriented behavior.

### Rumble Lifecycle

The backend owns the full lifecycle of a rumble:

- Create a rumble record
- Validate selected AI competitors
- Start orchestration when the stream opens
- Run the JAM round
- Run the Group Discussion round
- Open voting
- Accept and validate votes
- Calculate final results
- Persist all arguments and votes

### Async Orchestration

The orchestration layer uses native `async` / `await`. The JAM round runs model turns in parallel, while the Group Discussion round runs sequentially so each model can respond to previous arguments.

### SSE Streaming

The backend streams debate events over Server-Sent Events. Events include:

- Rumble started
- Round started
- AI turn started
- AI token
- AI turn completed
- Round completed
- Voting opened
- Vote update
- Rumble completed
- Error events

### Redis Stream Buffering

Realtime events are stored in Redis Streams. This gives the streaming layer a better production profile than process-local queues:

- Events can be replayed after reconnects.
- Clients may resume with `Last-Event-ID`.
- Vote updates and orchestration events share the same event channel.
- The service is less fragile when multiple clients watch the same rumble.

### Rate Limiting

The backend includes IP-hash-based rate limiting for:

- Rumble creation
- Vote submission

Raw IP addresses are not stored. IPs are hashed before use in Redis or database records.

### Voting Protection

Voting is guarded by:

- Rumble status checks
- AI selection validation
- Redis duplicate-vote checks
- PostgreSQL unique constraint on `(rumble_id, ip_hash)`

### Provider Registry

All AI providers are hidden behind a common provider interface. The orchestration layer calls the registry by AI name rather than coupling itself to provider-specific implementation details.

This makes it easier to add, remove, or replace providers without rewriting the rumble flow.

## Frontend Capabilities

The frontend is built as a branded arena experience rather than a generic form-based dashboard.

Current frontend responsibilities include:

- Product landing and arena-style presentation
- Navigation between rumble pages
- JAM, debate, voting, leaderboard, and results views
- Model metadata display
- Shared UI components
- Responsive styling with Tailwind
- Test setup with Vitest

The frontend has been cleaned of generated-template branding and project scaffolding traces.

## Local Development

### Prerequisites

Install the following before running the project locally:

- Node.js 18+
- npm
- Python 3.11+
- Docker Desktop
- Git

### Clone the Repository

```bash
git clone https://github.com/vutikurishanmukha9/AI-Royal-Rumble.git
cd AI-Royal-Rumble
```

### Run the Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend development server runs on the URL printed by Vite. In this project, the configured development port is commonly:

```text
http://localhost:8080
```

### Run the Backend

```bash
cd backend
copy .env.example .env
docker-compose up --build
```

The backend API runs at:

```text
http://localhost:8000
```

The backend health endpoint is:

```text
http://localhost:8000/api/v1/health
```

## Backend API Reference

### Health

```http
GET /api/v1/health
```

Returns service health, database connectivity, Redis connectivity, and a timestamp.

### List AI Models

```http
GET /api/v1/models
```

Returns all active AI competitors and public metadata used by the frontend.

### Create Rumble

```http
POST /api/v1/rumble
```

Example request:

```json
{
  "task": "Write a product launch announcement for a new AI coding assistant.",
  "selected_ais": ["gpt4o", "claude", "gemini"]
}
```

Example response:

```json
{
  "rumble_id": "00000000-0000-0000-0000-000000000000",
  "task": "Write a product launch announcement for a new AI coding assistant.",
  "selected_ais": ["gpt4o", "claude", "gemini"],
  "status": "created",
  "stream_url": "/api/v1/rumble/00000000-0000-0000-0000-000000000000/stream"
}
```

### Stream Rumble

```http
GET /api/v1/rumble/{rumble_id}/stream
```

Streams the live debate using Server-Sent Events.

Clients can resume from a previous event by sending:

```http
Last-Event-ID: <event_id>
```

or by using:

```text
?last_event_id=<event_id>
```

### Get Rumble State

```http
GET /api/v1/rumble/{rumble_id}
```

Returns the current persisted state of a rumble, including rounds, arguments, vote totals, status, and winner if available.

### Cast Vote

```http
POST /api/v1/rumble/{rumble_id}/vote
```

Example request:

```json
{
  "voted_ai": "claude"
}
```

Example response:

```json
{
  "success": true,
  "voted_ai": "claude",
  "current_votes": {
    "claude": 1
  },
  "total_votes": 1
}
```

### Get Results

```http
GET /api/v1/rumble/{rumble_id}/results
```

Returns final vote totals, winner metadata, key arguments, and completion timestamp.

## Realtime Streaming Model

The streaming layer uses Redis Streams as the event buffer. The backend publishes structured events into a rumble-specific stream:

```text
stream:rumble:{rumble_id}
```

Each event has:

- An event ID generated by Redis
- A typed event name
- A JSON payload

SSE clients receive events in this shape:

```text
id: 1710000000000-0
event: ai_token
data: {"ai_name":"gpt4o","token":"The","chunk":"The"}
```

This design supports reconnects, replay, and more reliable live viewing than process-local queues.

## Database Model

The backend stores durable rumble history in PostgreSQL.

### Core Tables

| Table | Purpose |
| --- | --- |
| `rumbles` | Top-level rumble metadata, status, selected models, winner, vote total |
| `rounds` | Debate rounds such as JAM and Group Discussion |
| `arguments` | AI-generated pitches, counters, defenses, and closing statements |
| `votes` | Vote records with hashed IP deduplication |
| `ai_models` | Model registry metadata used by orchestration and frontend display |

### Persistence Principles

- Store debate history permanently.
- Store raw user IP addresses nowhere.
- Use database constraints for critical vote integrity.
- Use Alembic migrations for schema changes.
- Keep auth additions additive and non-breaking.

## Environment Configuration

Backend configuration lives in:

```text
backend/.env
```

The example file is:

```text
backend/.env.example
```

Important infrastructure settings include:

```bash
DATABASE_URL=postgresql+asyncpg://user:password@localhost:5432/airoyalrumble
REDIS_URL=redis://localhost:6379/0
APP_ENV=development
CORS_ORIGINS=http://localhost:8080,https://yourapp.vercel.app
SECRET_KEY=replace-this-with-a-secure-secret
RATE_LIMIT_RUMBLES_PER_IP_PER_HOUR=5
RATE_LIMIT_VOTES_PER_IP_PER_HOUR=20
MAX_CONCURRENT_RUMBLES=50
MAX_TOKENS_PER_AI_JAM=300
MAX_TOKENS_PER_AI_GD_TURN=250
MAX_GD_ROUNDS=3
VOTING_WINDOW_SECONDS=300
STREAM_BUFFER_MAX_EVENTS=1000
RUMBLE_LOCK_TTL_SECONDS=900
AUTO_CREATE_TABLES=false
```

No secrets should be committed to the repository. Use local `.env` files for development and platform-managed environment variables in production.

## Testing and Verification

### Frontend

```bash
cd frontend
npm run build
npm run test
```

### Backend

```bash
cd backend
python -m pytest
```

### Backend Syntax Check

```bash
python -m compileall backend/app backend/tests
```

### Current Verified Status

The backend test suite includes coverage for:

- AI provider registry
- IP hash behavior
- Rumble model seed data
- Group Discussion contender selection
- Redis Stream event serialization
- Request schema normalization

## Deployment

The recommended production split is:

| Component | Recommended Platform |
| --- | --- |
| Frontend | Vercel or Netlify |
| Backend | Render or Railway |
| Database | Managed PostgreSQL |
| Redis | Managed Redis |

### Backend Deployment Commands

Build command:

```bash
pip install -r requirements.txt && alembic upgrade head
```

Start command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 2
```

Health check path:

```text
/api/v1/health
```

### SSE Deployment Requirement

The backend stream endpoint sends:

```http
X-Accel-Buffering: no
```

This is important because some platform proxies buffer responses by default. Without disabling buffering, clients may not receive events until the connection closes.

## Production Readiness Notes

The backend has been designed with several production concerns in mind:

- Async orchestration with FastAPI-native primitives
- Redis Stream event replay
- Redis-based duplicate orchestration locks
- Database-level vote deduplication
- Structured error responses
- Health endpoint for deployment platforms
- Migration-first production behavior
- Clear auth integration path
- No raw IP storage

Recommended next production steps:

- Add observability with structured logs and request IDs.
- Add provider-level retry and timeout policy tuning.
- Add integration tests with ephemeral PostgreSQL and Redis.
- Add CI workflow for frontend build and backend tests.
- Add frontend environment configuration for backend URL selection.
- Add rate-limit dashboards or operational metrics.

## Future Roadmap

Planned enhancements can be added without rewriting the core architecture:

- User accounts and saved rumble history
- Anonymous-to-authenticated session upgrade
- Shareable public result pages
- Manual voting close controls
- Admin model registry management
- Rumble replay mode
- Leaderboards by model, task type, and vote performance
- Better scoring heuristics for selecting Group Discussion finalists
- Provider health dashboard
- Cost and token usage analytics

## Project Status

The repository currently includes:

- A React/Vite frontend application
- Arena-style product pages
- A FastAPI backend service
- PostgreSQL schema and Alembic migration
- Redis-backed streaming and rate-limiting foundation
- AI provider registry abstraction
- Rumble orchestration services
- Voting and results services
- Docker Compose backend environment
- Backend tests
- Production-oriented README documentation

## License

A license has not been selected yet. Add one before public distribution or commercial deployment.
