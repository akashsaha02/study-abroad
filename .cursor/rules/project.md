# Abroadly Project Rules

## Stack
- Next.js App Router (16+), TypeScript, Tailwind CSS v4 (CSS-first in `globals.css`)
- Ant Design, Supabase Auth + Postgres + Storage, Resend
- Express REST API on port 3001 (`backend/`). Frontend rewrites `/api/*` to `BACKEND_URL`.

## Architecture
This is a **feature-based modular monolith**.

- Frontend features live in `frontend/src/features/<name>/`
- Backend modules live in `backend/src/modules/<name>/` (routes, controllers, services)
- Shared types, Zod schemas, and pure domain live in `packages/shared`
- `frontend/src/app` is routing only (thin pages)
- Express routers live with their domain module. Do not add Next.js-style `routes/**/route.ts` files.
- `frontend/src/infrastructure` holds Supabase clients, the API fetch wrapper, and auth loaders

## Data access
- HTML reads may query Supabase from feature `queries.ts` files (Server Components + RLS)
- All mutations go through Express. Do not add new Server Actions except auth.
- Client components call `apiFetch` from `@/infrastructure/api/client` (or `/api/...` during migration)
- Pages must not call `supabase.from` or `fetch("/api")` in new code — go through a feature module

## Conventions
- Route groups: `(public)`, `(auth)`, `(student)`, `(counselor)`, `(admin)`
- Always check user role from `profiles` table, never from `auth.users` metadata
- Zod schemas for a domain live in `packages/shared/src/validations/`
- Use `cn()` from `@/lib/utils` for class merging
- Prefer server components; add `"use client"` only when needed
- Features cannot import internals of another feature. Put shared UI in `components/` and shared domain in `@abroadly/shared`.

## Auth & Roles
- Roles: `student`, `counselor`, `admin`, `super_admin`
- `/dashboard/*` → student, admin, super_admin
- `/counselor/*` → counselor, admin, super_admin
- `/admin/*` → admin, super_admin only

## Database
- All tables use UUID primary keys
- RLS enabled on all sensitive tables
- Student documents are private; use signed URLs only

## Components
- Feature UI in `frontend/src/features/<name>/components/`
- Cross-cutting primitives remain in `src/components/common/`, `layout/`, `forms/`
- Marketing sections in `src/components/sections/`

## Naming
- Files: PascalCase for components, kebab-case for routes
- Database: snake_case
- Types: PascalCase interfaces matching table names

## Do Not
- Put domain logic in generic `lib/utils`
- Import one feature's internal files from another feature
- Expose permanent public URLs for student documents
- Skip RLS policies
- Use `tailwind.config.ts` (Tailwind v4 is CSS-first)
- Introduce microservices, Redux, or Clean Architecture folders
