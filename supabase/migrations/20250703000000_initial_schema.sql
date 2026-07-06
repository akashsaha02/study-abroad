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
-- INDEXES
-- ============================================================

create index idx_leads_status on public.leads(status);
create index idx_leads_assigned_counselor on public.leads(assigned_counselor_id);
create index idx_leads_source on public.leads(source);
create index idx_students_profile on public.students(profile_id);
create index idx_students_counselor on public.students(assigned_counselor_id);
create index idx_applications_student on public.applications(student_id);
create index idx_applications_status on public.applications(status);
create index idx_applications_counselor on public.applications(counselor_id);
create index idx_documents_student on public.documents(student_id);
create index idx_documents_status on public.documents(status);
create index idx_universities_country on public.universities(country_id);
create index idx_universities_slug on public.universities(slug);
create index idx_courses_university on public.courses(university_id);
create index idx_countries_slug on public.countries(slug);
create index idx_blog_posts_slug on public.blog_posts(slug);
create index idx_notifications_user on public.notifications(user_id, is_read);

-- ============================================================
-- TRIGGERS
-- ============================================================

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.handle_updated_at();
create trigger leads_updated_at before update on public.leads
  for each row execute function public.handle_updated_at();
create trigger students_updated_at before update on public.students
  for each row execute function public.handle_updated_at();
create trigger counselors_updated_at before update on public.counselors
  for each row execute function public.handle_updated_at();
create trigger countries_updated_at before update on public.countries
  for each row execute function public.handle_updated_at();
create trigger universities_updated_at before update on public.universities
  for each row execute function public.handle_updated_at();
create trigger courses_updated_at before update on public.courses
  for each row execute function public.handle_updated_at();
create trigger scholarships_updated_at before update on public.scholarships
  for each row execute function public.handle_updated_at();
create trigger applications_updated_at before update on public.applications
  for each row execute function public.handle_updated_at();
create trigger consultations_updated_at before update on public.consultations
  for each row execute function public.handle_updated_at();
create trigger blog_posts_updated_at before update on public.blog_posts
  for each row execute function public.handle_updated_at();
create trigger cost_settings_updated_at before update on public.cost_settings
  for each row execute function public.handle_updated_at();
create trigger eligibility_rules_updated_at before update on public.eligibility_rules
  for each row execute function public.handle_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.students enable row level security;
alter table public.counselors enable row level security;
alter table public.countries enable row level security;
alter table public.universities enable row level security;
alter table public.courses enable row level security;
alter table public.scholarships enable row level security;
alter table public.applications enable row level security;
alter table public.application_steps enable row level security;
alter table public.documents enable row level security;
alter table public.consultations enable row level security;
alter table public.notes enable row level security;
alter table public.notifications enable row level security;
alter table public.blog_posts enable row level security;
alter table public.faqs enable row level security;
alter table public.testimonials enable row level security;
alter table public.cost_settings enable row level security;
alter table public.eligibility_rules enable row level security;

-- profiles
create policy "Users can read own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Admins can read all profiles" on public.profiles
  for select using (public.get_user_role() in ('admin', 'super_admin'));
create policy "Admins can update all profiles" on public.profiles
  for update using (public.get_user_role() in ('admin', 'super_admin'));

-- leads
create policy "Anyone can insert leads" on public.leads
  for insert with check (true);
create policy "Admins can manage all leads" on public.leads
  for all using (public.get_user_role() in ('admin', 'super_admin'));
create policy "Counselors can read assigned leads" on public.leads
  for select using (
    public.get_user_role() = 'counselor'
    and assigned_counselor_id = auth.uid()
  );
create policy "Counselors can update assigned leads" on public.leads
  for update using (
    public.get_user_role() = 'counselor'
    and assigned_counselor_id = auth.uid()
  );

-- students
create policy "Students can read own record" on public.students
  for select using (profile_id = auth.uid());
create policy "Students can update own record" on public.students
  for update using (profile_id = auth.uid());
create policy "Admins can manage all students" on public.students
  for all using (public.get_user_role() in ('admin', 'super_admin'));
create policy "Counselors can read assigned students" on public.students
  for select using (
    public.get_user_role() = 'counselor'
    and assigned_counselor_id = auth.uid()
  );
create policy "Counselors can update assigned students" on public.students
  for update using (
    public.get_user_role() = 'counselor'
    and assigned_counselor_id = auth.uid()
  );

-- counselors
create policy "Admins can manage counselors" on public.counselors
  for all using (public.get_user_role() in ('admin', 'super_admin'));
create policy "Counselors can read own record" on public.counselors
  for select using (profile_id = auth.uid());

-- public content (read published)
create policy "Public can read published countries" on public.countries
  for select using (is_published = true);
create policy "Admins can manage countries" on public.countries
  for all using (public.get_user_role() in ('admin', 'super_admin'));

create policy "Public can read published universities" on public.universities
  for select using (is_published = true);
create policy "Admins can manage universities" on public.universities
  for all using (public.get_user_role() in ('admin', 'super_admin'));

create policy "Public can read published courses" on public.courses
  for select using (is_published = true);
create policy "Admins can manage courses" on public.courses
  for all using (public.get_user_role() in ('admin', 'super_admin'));

create policy "Public can read published scholarships" on public.scholarships
  for select using (is_published = true);
create policy "Admins can manage scholarships" on public.scholarships
  for all using (public.get_user_role() in ('admin', 'super_admin'));

create policy "Public can read published blog posts" on public.blog_posts
  for select using (is_published = true);
create policy "Admins can manage blog posts" on public.blog_posts
  for all using (public.get_user_role() in ('admin', 'super_admin'));

create policy "Public can read published faqs" on public.faqs
  for select using (is_published = true);
create policy "Admins can manage faqs" on public.faqs
  for all using (public.get_user_role() in ('admin', 'super_admin'));

create policy "Public can read published testimonials" on public.testimonials
  for select using (is_published = true);
create policy "Admins can manage testimonials" on public.testimonials
  for all using (public.get_user_role() in ('admin', 'super_admin'));

create policy "Public can read cost settings" on public.cost_settings
  for select using (true);
create policy "Admins can manage cost settings" on public.cost_settings
  for all using (public.get_user_role() in ('admin', 'super_admin'));

create policy "Public can read active eligibility rules" on public.eligibility_rules
  for select using (is_active = true);
create policy "Admins can manage eligibility rules" on public.eligibility_rules
  for all using (public.get_user_role() in ('admin', 'super_admin'));

-- applications
create policy "Students can read own applications" on public.applications
  for select using (
    student_id in (select id from public.students where profile_id = auth.uid())
  );
create policy "Admins can manage all applications" on public.applications
  for all using (public.get_user_role() in ('admin', 'super_admin'));
create policy "Counselors can manage assigned applications" on public.applications
  for all using (
    public.get_user_role() = 'counselor'
    and counselor_id = auth.uid()
  );

-- application_steps
create policy "Students can read own application steps" on public.application_steps
  for select using (
    application_id in (
      select a.id from public.applications a
      join public.students s on s.id = a.student_id
      where s.profile_id = auth.uid()
    )
  );
create policy "Admins can manage application steps" on public.application_steps
  for all using (public.get_user_role() in ('admin', 'super_admin'));
create policy "Counselors can manage assigned application steps" on public.application_steps
  for all using (
    public.get_user_role() = 'counselor'
    and application_id in (
      select id from public.applications where counselor_id = auth.uid()
    )
  );

-- documents
create policy "Students can manage own documents" on public.documents
  for all using (
    student_id in (select id from public.students where profile_id = auth.uid())
  );
create policy "Admins can manage all documents" on public.documents
  for all using (public.get_user_role() in ('admin', 'super_admin'));
create policy "Counselors can review assigned student documents" on public.documents
  for all using (
    public.get_user_role() = 'counselor'
    and student_id in (
      select id from public.students where assigned_counselor_id = auth.uid()
    )
  );

-- consultations
create policy "Students can read own consultations" on public.consultations
  for select using (
    student_id in (select id from public.students where profile_id = auth.uid())
  );
create policy "Students can request consultations" on public.consultations
  for insert with check (
    student_id in (select id from public.students where profile_id = auth.uid())
  );
create policy "Admins can manage consultations" on public.consultations
  for all using (public.get_user_role() in ('admin', 'super_admin'));
create policy "Counselors can manage assigned consultations" on public.consultations
  for all using (
    public.get_user_role() = 'counselor'
    and counselor_id = auth.uid()
  );

-- notes
create policy "Admins can manage all notes" on public.notes
  for all using (public.get_user_role() in ('admin', 'super_admin'));
create policy "Counselors can manage own notes" on public.notes
  for all using (
    public.get_user_role() = 'counselor'
    and author_id = auth.uid()
  );
create policy "Students can read student_visible notes" on public.notes
  for select using (
    visibility = 'student_visible'
    and student_id in (select id from public.students where profile_id = auth.uid())
  );

-- notifications
create policy "Users can read own notifications" on public.notifications
  for select using (user_id = auth.uid());
create policy "Users can update own notifications" on public.notifications
  for update using (user_id = auth.uid());
create policy "Admins can insert notifications" on public.notifications
  for insert with check (public.get_user_role() in ('admin', 'super_admin', 'counselor'));

-- ============================================================
-- STORAGE BUCKETS (run in Supabase dashboard or via API)
-- ============================================================
-- student-documents: private
-- profile-avatars: public
-- university-logos: public
-- blog-images: public
-- testimonial-images: public
