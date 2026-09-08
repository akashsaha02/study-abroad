# Abroadly — Project Context

Study abroad agency platform for lead generation, student management, and application tracking.

## Monorepo layout

```
study-abroad-agency/
├── frontend/          # Next.js UI (port 3000) — pages, SSR reads, feature modules
│   └── src/features/  # auth, leads, student, catalog, documents, applications, ...
├── backend/           # Express REST API (port 3001) — /api/* mutations
│   └── src/modules/   # identity, leads, eligibility, students, applications, cms
├── packages/shared    # Types, Zod schemas, eligibility engine, application phases
├── supabase/          # Database migrations & config
└── scripts/           # Seed & migration scripts
```

The frontend proxies `/api/*` to the backend via `BACKEND_URL`.
Local URLs live in `.env.local`. Production URLs are set on Vercel (`BACKEND_URL`) and Render (`FRONTEND_URL`) — see `.env.production.example`.

Reads for HTML happen in Next.js Server Components (feature `queries.ts` files).
Writes go through Express feature modules. Shared domain code lives in `@abroadly/shared`.
Pages import from `@/features/<name>/...`. Do not add compatibility re-exports at old `lib/` or `components/` paths.

## Stack
Next.js (frontend) | Express (backend API) | TypeScript | Tailwind CSS v4 | Ant Design | Supabase | Resend

## User Roles
- `student` — dashboard, applications, documents
- `counselor` — assigned leads, students, applications
- `admin` / `super_admin` — full CRM and content management

## Business Flow
Visitor → eligibility/contact → lead → admin review → counselor assigned → student → documents → application → tracking → visa → completion

## Route Structure (frontend)
```
(public)/     — SEO website, tools
(auth)/       — login, register, forgot/reset password
(student)/    — /dashboard/*
(counselor)/  — /counselor/*
(admin)/      — /admin/*
auth/callback — OAuth callback (frontend)
```

The Express API (port 3001) is organized by domain under `backend/src/modules/<name>/` (router, controller, service). The frontend rewrites `/api/*` to the backend.

## Database Enums
- `user_role`: student, counselor, admin, super_admin
- `lead_status`: new, contacted, qualified, not_qualified, converted_to_student, lost
- `application_status`: profile_review → documents_pending → university_shortlisting → application_submitted → offer_received → tuition_payment → visa_documents → visa_submitted → visa_approved → pre_departure → completed | rejected
- `document_status`: pending_review, approved, rejected, needs_update
- `consultation_status`: requested, scheduled, completed, cancelled

## Tables
profiles, leads, students, counselors, countries, universities, courses, scholarships, applications, application_steps, documents, consultations, notes, notifications, blog_posts, faqs, testimonials, cost_settings, eligibility_rules

## Storage Buckets
- `student-documents` (private)
- `profile-avatars`, `university-logos`, `blog-images`, `testimonial-images` (public)

## RLS Summary
- profiles: own read/update; admin reads all
- leads: public insert; admin/counselor read assigned
- students: own read/update; counselor/admin assigned
- applications: student read own; counselor/admin update assigned
- documents: student upload own; counselor/admin review

## Development

```bash
npm install          # from repo root
cp .env.example .env.local
npm run sync:env
npm run dev          # starts frontend :3000 + backend :3001
```
