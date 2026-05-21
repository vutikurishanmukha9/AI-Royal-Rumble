# AI Royal Rumble

> Every AI Claims Superiority. Tonight They Prove It.

A live arena where multiple AI models debate your task in real time. You watch. You vote.

## Project Structure

```
├── frontend/     # React + Vite + TypeScript (Tailwind, shadcn/ui, Framer Motion)
│   ├── vercel.json        ← Vercel deployment config
│   ├── netlify.toml       ← Netlify deployment config
│   └── .env.example       ← Frontend env vars
│
├── backend/      # FastAPI + PostgreSQL + Redis (AI orchestration, SSE streaming)
│   ├── render.yaml        ← Render Blueprint (auto-provisions everything)
│   ├── railway.toml       ← Railway deployment config
│   ├── railway.json       ← Railway deployment config (JSON format)
│   ├── nixpacks.toml      ← Railway Nixpacks build config
│   ├── Procfile           ← Universal process declaration
│   ├── runtime.txt        ← Python version pin
│   ├── Dockerfile         ← Docker container (local dev + deploy)
│   ├── docker-compose.yml ← Local dev stack (API + Postgres + Redis)
│   └── .env.example       ← Backend env vars
```

---

## Quick Start (Local Dev)

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev                # → http://localhost:8080
```

### Backend
```bash
cd backend
cp .env.example .env       # Fill in your AI API keys
docker-compose up --build  # → http://localhost:8000
```

---

## Deployment Guide

### Backend → Render

**Option A: Blueprint (recommended — one click)**
1. Go to Render Dashboard → **New** → **Blueprint**
2. Connect this repo, set **Root Directory** to `backend`
3. Render reads `render.yaml` and auto-provisions the Web Service, PostgreSQL, and Redis
4. In the service **Environment** tab, set your AI API keys
5. Update `CORS_ORIGINS` to your frontend URL

**Option B: Manual**
1. **New Web Service** → connect repo → Root Directory: `backend`
2. Build Command: `pip install -r requirements.txt && alembic upgrade head`
3. Start Command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT --workers 2`
4. Health Check Path: `/api/v1/health`
5. Add PostgreSQL and Redis as add-ons
6. Set env vars (see `backend/.env.example`)

---

### Backend → Railway

1. Go to Railway → **New Project**
2. **Add PostgreSQL** plugin
3. **Add Redis** plugin
4. **Add service from GitHub** → select this repo
5. In **Service Settings**, set Root Directory to `backend`
6. Railway auto-reads `railway.toml` for build/start commands
7. Link the PostgreSQL and Redis plugins via **Shared Variables**
8. In **Variables** tab, add your AI API keys + `CORS_ORIGINS`

---

### Frontend → Vercel

1. Go to Vercel → **Import Project**
2. Connect this repo
3. Set **Root Directory** to `frontend`
4. Framework: **Vite** (auto-detected from `vercel.json`)
5. In **Environment Variables**, set `VITE_API_BASE_URL` to your backend URL + `/api/v1`
6. Deploy — Vercel handles build + SPA routing automatically

---

### Frontend → Netlify

1. Go to Netlify → **Import from Git**
2. Connect this repo
3. Build settings (auto-detected from `netlify.toml`):
   - Base directory: `frontend`
   - Build command: `npm run build`
   - Publish directory: `frontend/dist`
4. In **Site settings → Environment variables**, set `VITE_API_BASE_URL` to your backend URL + `/api/v1`
5. Deploy!

---

## Environment Variables Cheat Sheet

### Backend (set in Render/Railway dashboard)

| Variable | Required | Description / Source |
|---|---|---|
| `DATABASE_URL` | ✅ | Database connection string (auto-injected by platform database add-on) |
| `REDIS_URL` | ✅ | Redis connection URL (auto-injected by platform Redis add-on) |
| `*_API_KEY` | ✅ | API keys for the chosen AI providers (e.g. OpenAI, Anthropic, Gemini, Groq, etc.) |
| `CORS_ORIGINS` | ✅ | Comma-separated list of your frontend URLs |
| `SECRET_KEY` | ✅ | A secure random string for security hashing |
| `APP_ENV` | ✅ | `production` |

### Frontend (set in Vercel/Netlify dashboard)

| Variable | Required | Value |
|---|---|---|
| `VITE_API_BASE_URL` | ✅ | Your backend base URL + `/api/v1` |
