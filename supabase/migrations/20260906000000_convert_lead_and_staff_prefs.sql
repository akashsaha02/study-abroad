-- Converted student id is students.id (not profiles.id).
-- Atomic convert_lead RPC. Staff can read preferred-country junction rows.

alter table public.leads
  add column if not exists converted_by uuid references public.profiles(id);

update public.leads l
set converted_student_id = s.id
from public.students s
where l.converted_student_id is not null
  and l.converted_student_id = s.profile_id
  and l.converted_student_id <> s.id;

alter table public.leads
  drop constraint if exists leads_converted_student_id_fkey;

alter table public.leads
  add constraint leads_converted_student_id_fkey
  foreign key (converted_student_id) references public.students(id);

create or replace function public.convert_lead(
  p_lead_id uuid,
  p_profile_id uuid,
  p_converted_by uuid
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_role text;
  v_lead public.leads%rowtype;
  v_student_id uuid;
  v_updated int;
begin
  v_role := public.get_user_role();
  if v_role not in ('admin', 'super_admin') then
    raise exception 'Forbidden';
  end if;

  select * into v_lead from public.leads where id = p_lead_id for update;
  if not found then
    raise exception 'Lead not found';
  end if;

  if v_lead.converted_student_id is not null then
    raise exception 'Lead already converted';
  end if;

  select id into v_student_id
  from public.students
  where profile_id = p_profile_id
  for update;

  if v_student_id is null then
    insert into public.students (
      profile_id,
      lead_id,
      preferred_country,
      preferred_country_id,
      preferred_subject,
      highest_education,
      cgpa,
      english_test_score,
      budget,
      assigned_counselor_id
    ) values (
      p_profile_id,
      p_lead_id,
      v_lead.preferred_country,
      v_lead.preferred_country_id,
      v_lead.subject_interest,
      v_lead.education_level,
      v_lead.last_result,
      case when v_lead.ielts_score is null then null else v_lead.ielts_score::text end,
      v_lead.budget,
      v_lead.assigned_counselor_id
    )
    returning id into v_student_id;
  else
    update public.students set
      lead_id = p_lead_id,
      preferred_country = coalesce(v_lead.preferred_country, preferred_country),
      preferred_country_id = coalesce(v_lead.preferred_country_id, preferred_country_id),
      preferred_subject = coalesce(v_lead.subject_interest, preferred_subject),
      highest_education = coalesce(v_lead.education_level, highest_education),
      cgpa = coalesce(v_lead.last_result, cgpa),
      english_test_score = coalesce(
        case when v_lead.ielts_score is null then null else v_lead.ielts_score::text end,
        english_test_score
      ),
      budget = coalesce(v_lead.budget, budget),
      assigned_counselor_id = coalesce(v_lead.assigned_counselor_id, assigned_counselor_id),
      updated_at = now()
    where id = v_student_id;
  end if;

  update public.leads set
    converted_student_id = v_student_id,
    converted_by = p_converted_by,
    status = 'converted_to_student',
    updated_at = now()
  where id = p_lead_id
    and converted_student_id is null;

  get diagnostics v_updated = row_count;
  if v_updated = 0 then
    raise exception 'Lead already converted';
  end if;

  return v_student_id;
end;
$$;

grant execute on function public.convert_lead(uuid, uuid, uuid) to authenticated;

drop policy if exists "student_preferred_countries_staff_select" on public.student_preferred_countries;
create policy "student_preferred_countries_staff_select"
  on public.student_preferred_countries
  for select
  using (public.get_user_role() in ('admin', 'super_admin', 'counselor'));
