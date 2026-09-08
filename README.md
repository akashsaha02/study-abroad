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

1. Copy local env (never use production URLs here):

```bash
cp .env.example .env.local
```

Fill in Supabase and Resend values. Keep:

```
NEXT_PUBLIC_APP_URL=http://localhost:3000
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:3001
```

2. Sync into each workspace and start both apps:

```bash
npm run sync:env
npm run dev
```

- **Frontend:** http://localhost:3000
- **Backend API:** http://localhost:3001/api

The frontend proxies `/api/*` to the backend via `BACKEND_URL`.

## Environment variables

Same **names** locally and in production — only the **values** change.

| Variable | Local (`.env.local`) | Vercel (frontend) | Render (backend) |
|---|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | project URL | same (or prod project) | same |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | anon key | yes | yes |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` | `https://your-app.vercel.app` | — |
| `BACKEND_URL` | `http://localhost:3001` | `https://your-api.onrender.com` | — |
| `FRONTEND_URL` | `http://localhost:3000` | — | `https://your-app.vercel.app` |
| `SUPABASE_SERVICE_ROLE_KEY` | service role | — | yes |
| `RESEND_API_KEY` / `RESEND_FROM_EMAIL` / `ADMIN_EMAIL` | optional locally | — | yes |

- Templates: `.env.example` (local) and `.env.production.example` (dashboards).
- `npm run sync:env` copies **frontend keys** to `frontend/.env.local` and **backend keys** to `backend/.env.local`.
- Do not put Render/Vercel URLs in `.env.local` — cookies and CORS will break.
- No trailing slashes on URL values.
- After changing `NEXT_PUBLIC_*` or `BACKEND_URL` on Vercel, **redeploy** (they are inlined at build time).

Add `http://localhost:3000/auth/callback` and `https://your-app.vercel.app/auth/callback` in Supabase **Authentication → URL Configuration**.

## Scripts

| Command | Description |
|---|---|
| `npm run sync:env` | Copy root `.env.local` into frontend & backend (scoped keys) |
| `npm run validate:env` | Check local vs production env example files |
| `npm run dev` | Start frontend + backend |
| `npm run dev:frontend` | UI only |
| `npm run dev:backend` | API only |
| `npm run build` | Build both packages |
| `npm run lint` | Lint both packages |
| `npm run check:ci` | Same checks as GitHub Actions CI (local pre-push) |
| `npm run seed:all` | Seed demo content & test users |

## CI / CD

GitHub Actions:

- **CI** (`.github/workflows/ci.yml`) — on pull requests and pushes to `main`/`dev`: validate env examples, lint, typecheck, build frontend and backend in parallel. Mark the **CI** job as a required status check on `main`.
- **CD** (`.github/workflows/cd.yml`) — after CI succeeds on `main` (or **Run workflow**). Deploys only if you set GitHub secrets; otherwise it skips and Vercel/Render Git deploys still apply.

Optional GitHub secrets (Actions → Secrets) if you want GitHub to ship after CI instead of host auto-deploy:

| Secret | Purpose |
|---|---|
| `VERCEL_TOKEN` | Vercel deploy from GitHub |
| `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID` | Vercel project |
| `RENDER_DEPLOY_HOOK_URL` | Render deploy hook |
| `BACKEND_HEALTH_URL` | Optional `https://your-api.onrender.com` health probe |

If those secrets are set, turn off automatic Git deploys on Vercel and Render so production only updates after CI.

Local hook (optional): `npm run setup:hooks` then `npm run check:ci` runs on every push.

## Deployment

Keep **one git repo**. Deploy two services. Keep the `/api` rewrite so auth cookies stay on the frontend origin.

### Frontend (Vercel)

Keep **Root Directory empty** (the Git repository root). Do not set it to `frontend` — Vercel looks for `.next` at the repo root, and `vercel.json` already builds the frontend workspace there.

Backend-only commits are skipped via `ignoreCommand`.

**Project → Settings → General → Build & Development Settings**

Turn **Override** off for Build / Install / Output so `vercel.json` is used. Then:

| Setting | Value |
|---|---|
| Root Directory | *empty* (not `frontend`) |
| Framework Preset | Next.js |
| Build Command | `npm exec -w @abroadly/frontend -- next build --webpack` |
| Install Command | `npm ci` |
| Output Directory | *empty* (not `public`, not `.next`) |

**Settings → Environment Variables** (Production):

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `NEXT_PUBLIC_APP_URL` — `https://your-app.vercel.app` (no trailing slash)
- `BACKEND_URL` — your Render URL, e.g. `https://abroadly-api.onrender.com` (no trailing slash)

Push to the branch Vercel deploys (`main` or `dev`), then Redeploy.

### Backend (Render)

Do **not** use Blueprint if Render asks for a card. Create a free web service by hand:

1. Render Dashboard → **New** → **Web Service** → connect this GitHub repo.
2. **Instance type:** Free (or paid to avoid cold starts).
3. Leave root directory empty (repo root).
4. Build: `npm ci`
5. Start: `npm run start:backend`
6. Add env vars from `.env.production.example` (Render section).
   - `FRONTEND_URL` must be the exact Vercel origin (no trailing slash)

Free instances sleep after ~15 minutes idle; the first request after that is slow. Health check path: `/health`.

## Stack

Next.js · Express · TypeScript · Tailwind CSS v4 · Ant Design · Supabase · Resend
