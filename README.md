# Abroadly — Study Abroad Agency Platform

Monorepo with separate **frontend** (Next.js UI) and **backend** (REST API).

## Structure

```
study-abroad-agency/
├── frontend/     # Next.js UI (port 3000)
├── backend/      # Express REST API (port 3001)
├── supabase/     # Database migrations & config
└── scripts/      # Seed & migration scripts
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

Deploy **frontend** and **backend** as separate services. Set:

- Frontend: `BACKEND_URL=https://api.yourdomain.com`
- Backend: `FRONTEND_URL=https://yourdomain.com` (for CORS)

## Stack

Next.js · Express · TypeScript · Tailwind CSS v4 · Ant Design · Supabase · Resend
