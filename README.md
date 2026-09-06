# Abroadly — Study Abroad Agency Platform

Monorepo with a **frontend** (Next.js UI), **backend** (REST API), and **shared** domain package.

## Structure

```
study-abroad-agency/
├── frontend/          # Next.js UI (port 3000)
├── backend/           # Express REST API (port 3001)
├── packages/shared    # Types, constants, country helpers
├── supabase/          # Database migrations & config
└── scripts/           # Seed & migration scripts
```

## Getting started

1. Copy environment variables:

```bash
cp .env.example .env.local
```

2. Copy and sync environment variables:

```bash
cp .env.example .env.local
npm run sync:env
```

3. Run both apps:

```bash
npm run dev
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api

The frontend proxies `/api/*` requests to the backend via `BACKEND_URL`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run sync:env` | Copy root `.env.local` to frontend & backend |
| `npm run dev` | Start frontend + backend |
| `npm run dev:frontend` | UI only |
| `npm run dev:backend` | API only |
| `npm run build` | Build both packages |
| `npm run lint` | Lint both packages |
| `npm run seed:all` | Seed demo content & test users |

## Deployment

### Frontend (Vercel)

Import the repo (root directory = repo root). Build is already set in `vercel.json`.

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL` — `https://your-app.vercel.app`
- `BACKEND_URL` — `https://abroadly-api.onrender.com` (no trailing slash)

### Backend (Render)

`render.yaml` defines the API. In Render: **New → Blueprint** → this repo.

When prompted, set:

- `FRONTEND_URL` — your Vercel origin (CORS)
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ADMIN_EMAIL`

Render sets `PORT`. Health check: `GET /health`.

Local API still uses `npm run start -w @abroadly/backend` (reads `.env.local`). Production uses `npm run start:backend`.

## Stack

Next.js · Express · TypeScript · Tailwind CSS v4 · Ant Design · Supabase · Resend
