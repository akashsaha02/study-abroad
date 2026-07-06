-- Add FK columns for country relations (keep legacy text fields for display/backfill)

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

-- Backfill from existing text fields

update public.leads l
set preferred_country_id = c.id
from public.countries c
where l.preferred_country_id is null
  and l.preferred_country is not null
  and (
    lower(trim(l.preferred_country)) = lower(trim(c.name))
    or lower(trim(l.preferred_country)) = lower(trim(c.slug))
  );

update public.students s
set preferred_country_id = c.id
from public.countries c
where s.preferred_country_id is null
  and s.preferred_country is not null
  and (
    lower(trim(s.preferred_country)) = lower(trim(c.name))
    or lower(trim(s.preferred_country)) = lower(trim(c.slug))
  );

update public.cost_settings cs
set country_id = c.id
from public.countries c
where cs.country_id is null
  and (
    lower(trim(cs.country)) = lower(trim(c.name))
    or lower(trim(cs.country)) = lower(trim(c.slug))
  );

update public.eligibility_rules er
set country_id = c.id
from public.countries c
where er.country_id is null
  and (
    lower(trim(er.country)) = lower(trim(c.name))
    or lower(trim(er.country)) = lower(trim(c.slug))
  );

update public.testimonials t
set country_id = c.id
from public.countries c
where t.country_id is null
  and t.destination_country is not null
  and (
    lower(trim(t.destination_country)) = lower(trim(c.name))
    or lower(trim(t.destination_country)) = lower(trim(c.slug))
  );

update public.testimonials t
set university_id = u.id
from public.universities u
where t.university_id is null
  and t.university_name is not null
  and lower(trim(t.university_name)) = lower(trim(u.name));

create index if not exists idx_leads_preferred_country on public.leads(preferred_country_id);
create index if not exists idx_students_preferred_country on public.students(preferred_country_id);
create index if not exists idx_cost_settings_country_id on public.cost_settings(country_id);
create index if not exists idx_eligibility_rules_country_id on public.eligibility_rules(country_id);
create index if not exists idx_testimonials_country_id on public.testimonials(country_id);
create index if not exists idx_testimonials_university_id on public.testimonials(university_id);
