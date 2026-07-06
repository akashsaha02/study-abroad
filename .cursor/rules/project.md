# Abroadly Project Rules

## Stack
- Next.js App Router (16+), TypeScript, Tailwind CSS v4 (CSS-first in `globals.css`)
- shadcn/ui (radix-maia), Supabase Auth + Postgres + Storage, Resend, Vercel

## Conventions
- Use `src/` directory structure as defined in PROJECT_CONTEXT.md
- Route groups: `(public)`, `(auth)`, `(student)`, `(counselor)`, `(admin)`
- Always check user role from `profiles` table, never from `auth.users` metadata
- Use Server Actions for mutations; public lead/eligibility endpoints use API routes
- Use Zod for all form validation in `src/lib/validations/`
- Use `cn()` from `@/lib/utils` for class merging
- Prefer server components; add `"use client"` only when needed

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
- Reusable UI in `src/components/common/`, `layout/`, `forms/`, `sections/`
- shadcn primitives in `src/components/ui/`
- Page-specific sections in `src/components/sections/`

## Naming
- Files: PascalCase for components, kebab-case for routes
- Database: snake_case
- Types: PascalCase interfaces matching table names

## Do Not
- Build dashboard features before public website + lead system foundation
- Expose permanent public URLs for student documents
- Skip RLS policies
- Use `tailwind.config.ts` (Tailwind v4 is CSS-first)
