-- Entity relation FK columns (keep legacy text fields for display/backfill)

alter table public.leads
  add column if not exists preferred_country_id uuid references public.countries(id);

alter table public.students
  add column if not exists preferred_country_id uuid references public.countries(id);

alter table public.cost_settings
  add column if not exists country_id uuid references public.countries(id);

alter table public.eligibility_rules
  add column if not exists country_id uuid references public.countries(id);

alter table public.testimonials
  add column if not exists country_id uuid references public.countries(id),
  add column if not exists university_id uuid references public.universities(id);
