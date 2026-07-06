-- Abroadly initial schema migration
-- Enums, tables, indexes, RLS policies, triggers

-- ============================================================
-- ENUMS
-- ============================================================

create type user_role as enum (
  'student',
  'counselor',
  'admin',
  'super_admin'
);

create type lead_status as enum (
  'new',
  'contacted',
  'qualified',
  'not_qualified',
  'converted_to_student',
  'lost'
);

create type application_status as enum (
  'profile_review',
  'documents_pending',
  'university_shortlisting',
  'application_submitted',
  'offer_received',
  'tuition_payment',
  'visa_documents',
  'visa_submitted',
  'visa_approved',
  'pre_departure',
  'completed',
  'rejected'
);

create type document_status as enum (
  'pending_review',
  'approved',
  'rejected',
  'needs_update'
);

create type consultation_status as enum (
  'requested',
  'scheduled',
  'completed',
  'cancelled'
);

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- ============================================================
-- TABLES
-- ============================================================

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text unique,
  phone text,
  role user_role not null default 'student',
  avatar_url text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text,
  phone text not null,
  preferred_country text,
  education_level text,
  subject_interest text,
  last_result text,
  ielts_score numeric,
  budget numeric,
  message text,
  source text default 'website',
  status lead_status default 'new',
  assigned_counselor_id uuid references public.profiles(id),
  converted_student_id uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.students (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references public.profiles(id) on delete cascade,
  lead_id uuid references public.leads(id),
  date_of_birth date,
  nationality text,
  current_address text,
  highest_education text,
  institution_name text,
  graduation_year int,
  cgpa text,
  english_test_type text,
  english_test_score text,
  preferred_country text,
  preferred_subject text,
  budget numeric,
  assigned_counselor_id uuid references public.profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.counselors (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid unique references public.profiles(id) on delete cascade,
  specialization text,
  bio text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.countries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  description text,
  hero_title text,
  hero_subtitle text,
  tuition_min numeric,
  tuition_max numeric,
  living_cost_min numeric,
  living_cost_max numeric,
  visa_summary text,
  admission_requirements text,
  scholarship_summary text,
  intakes text[],
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.universities (
  id uuid primary key default gen_random_uuid(),
  country_id uuid references public.countries(id) on delete cascade,
  name text not null,
  slug text unique not null,
  city text,
  logo_url text,
  website_url text,
  ranking text,
  description text,
  tuition_min numeric,
  tuition_max numeric,
  application_fee numeric,
  requirements text,
  intakes text[],
  scholarship_available boolean default false,
  is_featured boolean default false,
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.courses (
  id uuid primary key default gen_random_uuid(),
  university_id uuid references public.universities(id) on delete cascade,
  title text not null,
  slug text not null,
  degree_level text,
  subject_area text,
  duration text,
  tuition_fee numeric,
  application_fee numeric,
  language_requirement text,
  academic_requirement text,
  intakes text[],
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (university_id, slug)
);

create table public.scholarships (
  id uuid primary key default gen_random_uuid(),
  university_id uuid references public.universities(id),
  country_id uuid references public.countries(id),
  title text not null,
  slug text unique not null,
  degree_level text,
  amount text,
  eligibility text,
  deadline date,
  description text,
  application_link text,
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.students(id) on delete cascade,
  counselor_id uuid references public.profiles(id),
  country_id uuid references public.countries(id),
  university_id uuid references public.universities(id),
  course_id uuid references public.courses(id),
  intake text,
  status application_status default 'profile_review',
  priority text default 'normal',
  admin_note text,
  student_note text,
  submitted_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.application_steps (
  id uuid primary key default gen_random_uuid(),
  application_id uuid references public.applications(id) on delete cascade,
  title text not null,
  description text,
  status text default 'pending',
  sort_order int default 0,
  completed_at timestamptz,
  created_at timestamptz default now()
);

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  student_id uuid references public.students(id) on delete cascade,
  application_id uuid references public.applications(id) on delete cascade,
  document_type text not null,
  file_path text not null,
  file_name text,
  file_size int,
  mime_type text,
  status document_status default 'pending_review',
  review_note text,
  reviewed_by uuid references public.profiles(id),
  reviewed_at timestamptz,
  uploaded_at timestamptz default now()
);

create table public.consultations (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id),
  student_id uuid references public.students(id),
  counselor_id uuid references public.profiles(id),
  requested_date date,
  scheduled_at timestamptz,
  meeting_link text,
  status consultation_status default 'requested',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.notes (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles(id),
  lead_id uuid references public.leads(id),
  student_id uuid references public.students(id),
  application_id uuid references public.applications(id),
  content text not null,
  visibility text default 'internal',
  created_at timestamptz default now()
);

create table public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  message text not null,
  type text,
  is_read boolean default false,
  created_at timestamptz default now()
);

create table public.blog_posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text unique not null,
  excerpt text,
  content text,
  cover_image_url text,
  author_id uuid references public.profiles(id),
  meta_title text,
  meta_description text,
  is_published boolean default false,
  published_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table public.faqs (
  id uuid primary key default gen_random_uuid(),
  question text not null,
  answer text not null,
  category text,
  country_id uuid references public.countries(id),
  sort_order int default 0,
  is_published boolean default true,
  created_at timestamptz default now()
);

create table public.testimonials (
  id uuid primary key default gen_random_uuid(),
  student_name text not null,
  destination_country text,
  university_name text,
  quote text not null,
  image_url text,
  rating int default 5,
  is_published boolean default true,
  created_at timestamptz default now()
);

create table public.cost_settings (
  id uuid primary key default gen_random_uuid(),
  country text not null,
  degree_level text not null,
  tuition_min numeric,
  tuition_max numeric,
  living_cost_min numeric,
  living_cost_max numeric,
  visa_fee numeric,
  insurance_fee numeric,
  application_fee numeric,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (country, degree_level)
);

create table public.eligibility_rules (
  id uuid primary key default gen_random_uuid(),
  country text not null,
  education_level text not null,
  min_cgpa numeric,
  min_ielts numeric,
  min_budget numeric,
  recommendation text,
  is_active boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================================
-- PROFILE-DEPENDENT FUNCTIONS
-- ============================================================

create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    'student'
  );
  return new;
end;
$$ language plpgsql security definer;

create or replace function public.get_user_role()
returns user_role as $$
  select role from public.profiles where id = auth.uid();
$$ language sql stable security definer;

-- ============================================================