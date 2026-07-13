-- Student preferred countries (many-to-many)
create table if not exists public.student_preferred_countries (
  student_id uuid not null references public.students(id) on delete cascade,
  country_id uuid not null references public.countries(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (student_id, country_id)
);

-- Lead context for contact/consultation prefilling
alter table public.leads
  add column if not exists university_id uuid references public.universities(id),
  add column if not exists course_id uuid references public.courses(id),
  add column if not exists service_slug text;

-- Services catalog
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  price numeric not null default 0,
  discount_percent numeric not null default 0 check (discount_percent >= 0 and discount_percent <= 100),
  sort_order int not null default 0,
  is_published boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Service order requests (no payment gateway)
create type public.service_order_status as enum ('pending', 'confirmed', 'cancelled');

create table if not exists public.service_orders (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete restrict,
  lead_id uuid references public.leads(id) on delete set null,
  student_id uuid references public.students(id) on delete set null,
  quantity int not null default 1 check (quantity > 0),
  unit_price numeric not null,
  discount_applied numeric not null default 0,
  status public.service_order_status not null default 'pending',
  notes text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Newsletter subscribers
create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  is_active boolean not null default true,
  subscribed_at timestamptz default now(),
  unsubscribed_at timestamptz
);

-- Seed default services from static catalog
insert into public.services (slug, title, description, price, discount_percent, sort_order, is_published)
values
  ('admission-processing', 'Admission Processing', 'End-to-end university application support from shortlisting to offer letter.', 15000, 10, 1, true),
  ('student-visa-support', 'Student Visa Support', 'Expert visa documentation and submission guidance for your destination country.', 12000, 0, 2, true),
  ('sop-lor-guidance', 'SOP & LOR Guidance', 'Professional help crafting compelling statements and recommendation letters.', 8000, 15, 3, true),
  ('scholarship-guidance', 'Scholarship Guidance', 'Identify and apply for scholarships that match your profile and goals.', 6000, 0, 4, true),
  ('pre-departure-support', 'Pre-departure Support', 'Accommodation, travel, and orientation support before you fly.', 5000, 5, 5, true)
on conflict (slug) do nothing;

-- RLS policies
alter table public.student_preferred_countries enable row level security;
alter table public.services enable row level security;
alter table public.service_orders enable row level security;
alter table public.newsletter_subscribers enable row level security;

create policy "student_preferred_countries_select_own"
  on public.student_preferred_countries for select
  using (
    exists (
      select 1 from public.students s
      where s.id = student_id and s.profile_id = auth.uid()
    )
  );

create policy "student_preferred_countries_manage_own"
  on public.student_preferred_countries for all
  using (
    exists (
      select 1 from public.students s
      where s.id = student_id and s.profile_id = auth.uid()
    )
  );

create policy "services_public_read"
  on public.services for select
  using (is_published = true);

create policy "services_admin_all"
  on public.services for all
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'super_admin')
    )
  );

create policy "service_orders_select_own"
  on public.service_orders for select
  using (
    exists (
      select 1 from public.students s
      where s.id = student_id and s.profile_id = auth.uid()
    )
    or exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'super_admin', 'counselor')
    )
  );

create policy "service_orders_insert_public"
  on public.service_orders for insert
  with check (true);

create policy "service_orders_admin_update"
  on public.service_orders for update
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'super_admin')
    )
  );

create policy "newsletter_subscribers_insert_public"
  on public.newsletter_subscribers for insert
  with check (true);

create policy "newsletter_subscribers_admin_read"
  on public.newsletter_subscribers for select
  using (
    exists (
      select 1 from public.profiles p
      where p.id = auth.uid() and p.role in ('admin', 'super_admin')
    )
  );
