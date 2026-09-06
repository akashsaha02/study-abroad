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

The last failed build looked for a `public/` folder because the Framework Preset was **Other**. Next.js lives in `frontend/`, so the Vercel project must point there.

**Project → Settings → General → Build & Development Settings**

| Setting | Value |
|---|---|
| Root Directory | `frontend` |
| Framework Preset | Next.js |
| Build Command | `next build` (or leave default) |
| Install Command | `cd .. && npm install` |
| Output Directory | leave **empty** (do not set `public`) |

Then **Settings → Environment Variables** (Production + Preview):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL` — `https://your-app.vercel.app` (no trailing slash)
- `BACKEND_URL` — your Render URL, e.g. `https://abroadly-api.onrender.com` (no trailing slash)

Redeploy the `dev` (or `main`) branch after saving. Do not add a root `public/` folder — that would ship a static site, not the Next.js app.

### Backend (Render, free)

Do **not** use Blueprint if Render asks for a card. Create a free web service by hand:

1. Render Dashboard → **New** → **Web Service** → connect this GitHub repo.
2. **Instance type:** Free.
3. Leave root directory empty (repo root).
4. Build: `npm ci`
5. Start: `npm run start:backend`
6. Add env vars:
   - `FRONTEND_URL` — your Vercel origin
   - `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `ADMIN_EMAIL`

Free instances sleep after ~15 minutes idle; the first request after that is slow. Health check path: `/health`.

## Stack

Next.js · Express · TypeScript · Tailwind CSS v4 · Ant Design · Supabase · Resend
