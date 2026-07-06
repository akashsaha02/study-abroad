# Abroadly — Project Context

Study abroad agency platform for lead generation, student management, and application tracking.

## Stack
Next.js App Router | TypeScript | Tailwind CSS v4 | shadcn/ui | Supabase | Resend | Vercel

## User Roles
- `student` — dashboard, applications, documents
- `counselor` — assigned leads, students, applications
- `admin` / `super_admin` — full CRM and content management

## Business Flow
Visitor → eligibility/contact → lead → admin review → counselor assigned → student → documents → application → tracking → visa → completion

## Route Structure
```
(public)/     — SEO website, tools
(auth)/       — login, register, forgot/reset password
(student)/    — /dashboard/*
(counselor)/  — /counselor/*
(admin)/      — /admin/*
api/          — leads, eligibility, calculator, webhooks
```

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

## Build Order
1. Foundation + DB + auth
2. Public website
3. Lead generation tools
4. Admin CRM
5. Student dashboard
6. Application/document management
7. Counselor dashboard
8. Content management
9. Polish + deploy
