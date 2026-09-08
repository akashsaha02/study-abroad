-- IELTS product module: question bank, tests, attempts, analytics, staff.

create extension if not exists pgcrypto;

do $$ begin
  create type public.ielts_skill as enum ('listening', 'reading', 'writing', 'speaking');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.ielts_module_type as enum ('academic', 'general', 'both');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.ielts_difficulty as enum ('easy', 'medium', 'hard');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.ielts_content_status as enum ('draft', 'review', 'published', 'archived');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.ielts_test_kind as enum ('full', 'skill', 'practice');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.ielts_visibility as enum ('public', 'students', 'hidden');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.ielts_review_policy as enum ('immediate', 'after_submit', 'never');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.ielts_attempt_status as enum (
    'not_started', 'in_progress', 'submitted', 'evaluating', 'completed', 'expired'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.ielts_attempt_kind as enum ('practice', 'mock', 'skill_test');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.ielts_staff_role as enum ('manager', 'editor', 'reviewer');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.ielts_evaluation_status as enum ('pending', 'manual', 'completed');
exception when duplicate_object then null;
end $$;

create table if not exists public.ielts_staff (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  staff_role public.ielts_staff_role not null default 'editor',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create or replace function public.is_ielts_staff()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(public.get_user_role() in ('admin', 'super_admin'), false)
    or exists (
      select 1 from public.ielts_staff s
      where s.profile_id = auth.uid()
    );
$$;

create or replace function public.ielts_staff_role()
returns public.ielts_staff_role
language sql
stable
security definer
set search_path = public
as $$
  select s.staff_role from public.ielts_staff s where s.profile_id = auth.uid() limit 1;
$$;

create table if not exists public.ielts_passages (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  body text not null,
  skill public.ielts_skill not null default 'reading',
  ielts_type public.ielts_module_type not null default 'academic',
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ielts_media (
  id uuid primary key default gen_random_uuid(),
  bucket text not null,
  path text not null,
  kind text not null check (kind in ('audio', 'image', 'diagram')),
  mime_type text,
  duration_ms int,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.ielts_questions (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  skill public.ielts_skill not null,
  ielts_type public.ielts_module_type not null default 'academic',
  section text,
  question_type text not null,
  difficulty public.ielts_difficulty not null default 'medium',
  passage_id uuid references public.ielts_passages(id) on delete set null,
  media_id uuid references public.ielts_media(id) on delete set null,
  instructions text,
  question_text text not null,
  prompt text,
  options jsonb,
  correct_answer text,
  accepted_answers text[],
  explanation text,
  marks int not null default 1 check (marks > 0),
  tags text[] not null default '{}',
  source text,
  status public.ielts_content_status not null default 'draft',
  word_min int,
  word_max int,
  suggested_minutes int,
  cue_card jsonb,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  reviewed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  published_at timestamptz
);

create table if not exists public.ielts_question_stats (
  question_id uuid primary key references public.ielts_questions(id) on delete cascade,
  attempts int not null default 0,
  correct_count int not null default 0,
  incorrect_count int not null default 0,
  skipped_count int not null default 0,
  total_time_ms bigint not null default 0,
  updated_at timestamptz not null default now()
);

create table if not exists public.ielts_tests (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  ielts_type public.ielts_module_type not null default 'academic',
  kind public.ielts_test_kind not null default 'skill',
  skill public.ielts_skill,
  duration_seconds int not null default 3600 check (duration_seconds > 0),
  attempt_limit int,
  visibility public.ielts_visibility not null default 'students',
  review_policy public.ielts_review_policy not null default 'after_submit',
  allow_audio_replay boolean not null default true,
  status public.ielts_content_status not null default 'draft',
  published_at timestamptz,
  ends_at timestamptz,
  created_by uuid references public.profiles(id) on delete set null,
  updated_by uuid references public.profiles(id) on delete set null,
  reviewed_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ielts_test_sections (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references public.ielts_tests(id) on delete cascade,
  skill public.ielts_skill not null,
  title text not null,
  sort_order int not null default 0,
  duration_seconds int,
  passage_id uuid references public.ielts_passages(id) on delete set null,
  media_id uuid references public.ielts_media(id) on delete set null
);

create table if not exists public.ielts_test_questions (
  id uuid primary key default gen_random_uuid(),
  test_id uuid not null references public.ielts_tests(id) on delete cascade,
  section_id uuid references public.ielts_test_sections(id) on delete cascade,
  question_id uuid not null references public.ielts_questions(id) on delete restrict,
  sort_order int not null default 0,
  unique (test_id, question_id)
);

create table if not exists public.ielts_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  test_id uuid references public.ielts_tests(id) on delete set null,
  kind public.ielts_attempt_kind not null default 'practice',
  status public.ielts_attempt_status not null default 'in_progress',
  started_at timestamptz not null default now(),
  submitted_at timestamptz,
  expires_at timestamptz,
  duration_seconds int,
  raw_score numeric,
  max_score numeric,
  estimated_band numeric,
  section_scores jsonb,
  practice_filters jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ielts_attempt_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.ielts_attempts(id) on delete cascade,
  question_id uuid not null references public.ielts_questions(id) on delete restrict,
  answer jsonb,
  is_correct boolean,
  marks_awarded numeric,
  time_spent_ms int not null default 0,
  flagged boolean not null default false,
  answered_at timestamptz,
  unique (attempt_id, question_id)
);

create table if not exists public.ielts_bookmarks (
  user_id uuid not null references public.profiles(id) on delete cascade,
  question_id uuid not null references public.ielts_questions(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, question_id)
);

create table if not exists public.ielts_question_reports (
  id uuid primary key default gen_random_uuid(),
  question_id uuid not null references public.ielts_questions(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  message text not null,
  status text not null default 'open',
  created_at timestamptz not null default now()
);

create table if not exists public.ielts_writing_submissions (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.ielts_attempts(id) on delete cascade,
  question_id uuid not null references public.ielts_questions(id) on delete restrict,
  content text not null default '',
  word_count int not null default 0,
  evaluation_status public.ielts_evaluation_status not null default 'pending',
  evaluator_id uuid references public.profiles(id) on delete set null,
  band numeric,
  feedback text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (attempt_id, question_id)
);

create table if not exists public.ielts_speaking_submissions (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.ielts_attempts(id) on delete cascade,
  question_id uuid not null references public.ielts_questions(id) on delete restrict,
  storage_path text,
  duration_ms int,
  evaluation_status public.ielts_evaluation_status not null default 'pending',
  evaluator_id uuid references public.profiles(id) on delete set null,
  band numeric,
  feedback text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (attempt_id, question_id)
);

create table if not exists public.ielts_student_settings (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  target_band numeric,
  updated_at timestamptz not null default now()
);

create table if not exists public.ielts_band_tables (
  id uuid primary key default gen_random_uuid(),
  skill public.ielts_skill not null,
  ielts_type public.ielts_module_type not null,
  min_raw int not null,
  band numeric not null,
  unique (skill, ielts_type, min_raw)
);

create index if not exists ielts_questions_skill_type_idx
  on public.ielts_questions (skill, question_type, status, difficulty);
create index if not exists ielts_questions_created_by_idx on public.ielts_questions (created_by);
create index if not exists ielts_tests_status_idx on public.ielts_tests (status, visibility);
create index if not exists ielts_attempts_user_idx on public.ielts_attempts (user_id, started_at desc);
create index if not exists ielts_attempts_test_idx on public.ielts_attempts (test_id, status);
create index if not exists ielts_attempt_answers_attempt_idx on public.ielts_attempt_answers (attempt_id);

insert into public.ielts_band_tables (skill, ielts_type, min_raw, band) values
  ('listening', 'academic', 39, 9), ('listening', 'academic', 37, 8.5),
  ('listening', 'academic', 35, 8), ('listening', 'academic', 32, 7.5),
  ('listening', 'academic', 30, 7), ('listening', 'academic', 26, 6.5),
  ('listening', 'academic', 23, 6), ('listening', 'academic', 18, 5.5),
  ('listening', 'academic', 16, 5), ('listening', 'academic', 13, 4.5),
  ('listening', 'academic', 11, 4), ('listening', 'academic', 8, 3.5),
  ('listening', 'academic', 6, 3), ('listening', 'academic', 0, 2.5),
  ('listening', 'general', 39, 9), ('listening', 'general', 37, 8.5),
  ('listening', 'general', 35, 8), ('listening', 'general', 32, 7.5),
  ('listening', 'general', 30, 7), ('listening', 'general', 26, 6.5),
  ('listening', 'general', 23, 6), ('listening', 'general', 18, 5.5),
  ('listening', 'general', 16, 5), ('listening', 'general', 13, 4.5),
  ('listening', 'general', 11, 4), ('listening', 'general', 8, 3.5),
  ('listening', 'general', 6, 3), ('listening', 'general', 0, 2.5),
  ('reading', 'academic', 39, 9), ('reading', 'academic', 37, 8.5),
  ('reading', 'academic', 35, 8), ('reading', 'academic', 33, 7.5),
  ('reading', 'academic', 30, 7), ('reading', 'academic', 27, 6.5),
  ('reading', 'academic', 23, 6), ('reading', 'academic', 19, 5.5),
  ('reading', 'academic', 15, 5), ('reading', 'academic', 13, 4.5),
  ('reading', 'academic', 10, 4), ('reading', 'academic', 8, 3.5),
  ('reading', 'academic', 6, 3), ('reading', 'academic', 0, 2.5),
  ('reading', 'general', 40, 9), ('reading', 'general', 39, 8.5),
  ('reading', 'general', 37, 8), ('reading', 'general', 36, 7.5),
  ('reading', 'general', 34, 7), ('reading', 'general', 32, 6.5),
  ('reading', 'general', 30, 6), ('reading', 'general', 27, 5.5),
  ('reading', 'general', 23, 5), ('reading', 'general', 19, 4.5),
  ('reading', 'general', 15, 4), ('reading', 'general', 12, 3.5),
  ('reading', 'general', 9, 3), ('reading', 'general', 0, 2.5)
on conflict do nothing;

-- Sample published content reused from the previous static mock.
insert into public.ielts_passages (id, title, body, skill, ielts_type)
values (
  '11111111-1111-1111-1111-111111111111',
  'The Rise of Urban Vertical Farming',
  'As the world''s population becomes increasingly concentrated in cities, the challenge of feeding urban populations sustainably has never been more pressing. Traditional agriculture, dependent on vast tracts of arable land and long supply chains, struggles to meet the demands of dense metropolitan areas. Into this gap has stepped a novel solution: vertical farming, the practice of growing crops in stacked layers within controlled indoor environments.

Vertical farms rely on technologies such as hydroponics, where plants grow in nutrient-rich water rather than soil, and precisely tuned LED lighting that mimics the wavelengths most useful for photosynthesis. Because these systems are enclosed, they are largely immune to the vagaries of weather, pests, and seasonal change. A single vertical farm can therefore produce harvests year-round, often using a fraction of the water required by conventional fields.

Critics, however, point to the significant energy costs involved. Artificial lighting and climate control consume large amounts of electricity, and unless that power comes from renewable sources, the environmental benefits may be undercut. Proponents counter that rapid advances in energy efficiency, coupled with the elimination of transportation emissions, tilt the balance firmly in favour of vertical systems.

Perhaps the most compelling argument concerns resilience. By situating food production within cities themselves, vertical farming shortens supply chains dramatically, reducing the risk of disruption from extreme weather or geopolitical instability. For many urban planners, this local resilience—not merely efficiency—represents the true promise of the vertical farm.',
  'reading',
  'academic'
) on conflict (id) do nothing;

insert into public.ielts_questions (
  id, title, skill, ielts_type, question_type, difficulty, passage_id,
  question_text, options, correct_answer, accepted_answers, explanation, status, published_at, tags
) values
(
  '22222222-2222-2222-2222-222222222221',
  'Vertical farming — hydroponics',
  'reading', 'academic', 'sentence_completion', 'easy',
  '11111111-1111-1111-1111-111111111111',
  'Vertical farms grow plants in nutrient-rich water using a technique called ______.',
  null, 'hydroponics', array['hydroponic'],
  'The second paragraph names hydroponics as growing plants in nutrient-rich water.',
  'published', now(), array['environment','agriculture']
),
(
  '22222222-2222-2222-2222-222222222222',
  'Vertical farming — criticism',
  'reading', 'academic', 'multiple_choice', 'medium',
  '11111111-1111-1111-1111-111111111111',
  'According to the passage, what is the main criticism of vertical farming?',
  '[{"id":"A","text":"It cannot grow crops year-round"},{"id":"B","text":"It requires large amounts of electricity"},{"id":"C","text":"It is vulnerable to pests"},{"id":"D","text":"It needs vast tracts of land"}]'::jsonb,
  'B', array['it requires large amounts of electricity'],
  'Paragraph 3 says critics point to significant energy costs and electricity use.',
  'published', now(), array['environment']
),
(
  '22222222-2222-2222-2222-222222222223',
  'Vertical farming — lighting',
  'reading', 'academic', 'sentence_completion', 'easy',
  '11111111-1111-1111-1111-111111111111',
  'The type of lighting used in vertical farms is described as ______ lighting.',
  null, 'led', array['led lighting'],
  'Paragraph 2 refers to precisely tuned LED lighting.',
  'published', now(), array['environment']
),
(
  '22222222-2222-2222-2222-222222222224',
  'Vertical farming — true promise',
  'reading', 'academic', 'multiple_choice', 'medium',
  '11111111-1111-1111-1111-111111111111',
  'Which benefit do urban planners consider the ''true promise'' of vertical farming?',
  '[{"id":"A","text":"Higher profits"},{"id":"B","text":"Energy efficiency"},{"id":"C","text":"Local resilience"},{"id":"D","text":"Larger harvests"}]'::jsonb,
  'C', array['local resilience'],
  'The final paragraph states local resilience is the true promise.',
  'published', now(), array['environment']
),
(
  '22222222-2222-2222-2222-222222222225',
  'Vertical farming — seasonal change',
  'reading', 'academic', 'sentence_completion', 'easy',
  '11111111-1111-1111-1111-111111111111',
  'Vertical farms are largely immune to weather, pests and ______ change.',
  null, 'seasonal', array['seasonal change'],
  'Paragraph 2 lists weather, pests, and seasonal change.',
  'published', now(), array['environment']
),
(
  '33333333-3333-3333-3333-333333333331',
  'Campus orientation — room',
  'listening', 'academic', 'form_completion', 'easy',
  null,
  'The orientation session will be held in Room ______.',
  null, '12b', array['12 b'],
  'Sample listening item for practice.',
  'published', now(), array['campus']
),
(
  '33333333-3333-3333-3333-333333333332',
  'Campus orientation — keys',
  'listening', 'academic', 'note_completion', 'easy',
  null,
  'Students should bring their ______ card to collect keys.',
  null, 'id', array['identity', 'student id'],
  'Sample listening item for practice.',
  'published', now(), array['campus']
),
(
  '44444444-4444-4444-4444-444444444441',
  'Universities and the workplace',
  'writing', 'academic', 'task_2', 'medium',
  null,
  'Discuss both views and give your own opinion.',
  null, null, null,
  null,
  'published', now(), array['education']
)
on conflict (id) do nothing;

update public.ielts_questions
set prompt = 'Some people believe that universities should focus on providing academic skills, while others think they should prepare students for the workplace. Discuss both views and give your own opinion. Write at least 250 words.',
    word_min = 250,
    suggested_minutes = 40
where id = '44444444-4444-4444-4444-444444444441';

insert into public.ielts_tests (
  id, title, description, ielts_type, kind, skill, duration_seconds,
  visibility, review_policy, status, published_at
) values (
  '55555555-5555-5555-5555-555555555555',
  'Academic Reading — Vertical Farming',
  'A short published reading set from the question bank.',
  'academic', 'skill', 'reading', 1200,
  'public', 'after_submit', 'published', now()
) on conflict (id) do nothing;

insert into public.ielts_test_sections (id, test_id, skill, title, sort_order)
values (
  '55555555-5555-5555-5555-555555555556',
  '55555555-5555-5555-5555-555555555555',
  'reading', 'Passage 1', 0
) on conflict (id) do nothing;

insert into public.ielts_test_questions (test_id, section_id, question_id, sort_order)
values
  ('55555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555556', '22222222-2222-2222-2222-222222222221', 1),
  ('55555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555556', '22222222-2222-2222-2222-222222222222', 2),
  ('55555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555556', '22222222-2222-2222-2222-222222222223', 3),
  ('55555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555556', '22222222-2222-2222-2222-222222222224', 4),
  ('55555555-5555-5555-5555-555555555555', '55555555-5555-5555-5555-555555555556', '22222222-2222-2222-2222-222222222225', 5)
on conflict do nothing;

insert into storage.buckets (id, name, public)
values ('ielts-media', 'ielts-media', false),
       ('ielts-speaking', 'ielts-speaking', false)
on conflict (id) do nothing;

alter table public.ielts_staff enable row level security;
alter table public.ielts_passages enable row level security;
alter table public.ielts_media enable row level security;
alter table public.ielts_questions enable row level security;
alter table public.ielts_question_stats enable row level security;
alter table public.ielts_tests enable row level security;
alter table public.ielts_test_sections enable row level security;
alter table public.ielts_test_questions enable row level security;
alter table public.ielts_attempts enable row level security;
alter table public.ielts_attempt_answers enable row level security;
alter table public.ielts_bookmarks enable row level security;
alter table public.ielts_question_reports enable row level security;
alter table public.ielts_writing_submissions enable row level security;
alter table public.ielts_speaking_submissions enable row level security;
alter table public.ielts_student_settings enable row level security;
alter table public.ielts_band_tables enable row level security;

-- Staff
create policy ielts_staff_select on public.ielts_staff for select
  using (public.is_ielts_staff() or profile_id = auth.uid());
create policy ielts_staff_admin on public.ielts_staff for all
  using (public.get_user_role() in ('admin', 'super_admin'))
  with check (public.get_user_role() in ('admin', 'super_admin'));

-- Passages / questions / tests: staff manage; published readable
create policy ielts_passages_staff on public.ielts_passages for all
  using (public.is_ielts_staff()) with check (public.is_ielts_staff());
create policy ielts_passages_read_pub on public.ielts_passages for select
  using (
    exists (
      select 1 from public.ielts_questions q
      where q.passage_id = ielts_passages.id and q.status = 'published'
    )
  );

create policy ielts_media_staff on public.ielts_media for all
  using (public.is_ielts_staff()) with check (public.is_ielts_staff());
create policy ielts_media_own_speaking on public.ielts_media for select
  using (created_by = auth.uid());

create policy ielts_questions_staff on public.ielts_questions for all
  using (public.is_ielts_staff()) with check (public.is_ielts_staff());
create policy ielts_questions_published on public.ielts_questions for select
  using (status = 'published');

create policy ielts_qstats_staff on public.ielts_question_stats for all
  using (public.is_ielts_staff()) with check (public.is_ielts_staff());
create policy ielts_qstats_read_pub on public.ielts_question_stats for select
  using (
    exists (
      select 1 from public.ielts_questions q
      where q.id = question_id and q.status = 'published'
    )
  );

create policy ielts_tests_staff on public.ielts_tests for all
  using (public.is_ielts_staff()) with check (public.is_ielts_staff());
create policy ielts_tests_published on public.ielts_tests for select
  using (
    status = 'published'
    and visibility in ('public', 'students')
    and (ends_at is null or ends_at > now())
  );

create policy ielts_sections_staff on public.ielts_test_sections for all
  using (public.is_ielts_staff()) with check (public.is_ielts_staff());
create policy ielts_sections_read on public.ielts_test_sections for select
  using (
    exists (
      select 1 from public.ielts_tests t
      where t.id = test_id and t.status = 'published'
    )
  );

create policy ielts_tq_staff on public.ielts_test_questions for all
  using (public.is_ielts_staff()) with check (public.is_ielts_staff());
create policy ielts_tq_read on public.ielts_test_questions for select
  using (
    exists (
      select 1 from public.ielts_tests t
      where t.id = test_id and t.status = 'published'
    )
  );

create policy ielts_attempts_own on public.ielts_attempts for all
  using (user_id = auth.uid() or public.is_ielts_staff())
  with check (user_id = auth.uid() or public.is_ielts_staff());

create policy ielts_answers_own on public.ielts_attempt_answers for all
  using (
    public.is_ielts_staff()
    or exists (select 1 from public.ielts_attempts a where a.id = attempt_id and a.user_id = auth.uid())
  )
  with check (
    public.is_ielts_staff()
    or exists (select 1 from public.ielts_attempts a where a.id = attempt_id and a.user_id = auth.uid())
  );

create policy ielts_bookmarks_own on public.ielts_bookmarks for all
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy ielts_reports_own on public.ielts_question_reports for insert
  with check (user_id = auth.uid());
create policy ielts_reports_read on public.ielts_question_reports for select
  using (user_id = auth.uid() or public.is_ielts_staff());
create policy ielts_reports_staff on public.ielts_question_reports for update
  using (public.is_ielts_staff());

create policy ielts_writing_own on public.ielts_writing_submissions for all
  using (
    public.is_ielts_staff()
    or exists (select 1 from public.ielts_attempts a where a.id = attempt_id and a.user_id = auth.uid())
  )
  with check (
    public.is_ielts_staff()
    or exists (select 1 from public.ielts_attempts a where a.id = attempt_id and a.user_id = auth.uid())
  );

create policy ielts_speaking_own on public.ielts_speaking_submissions for all
  using (
    public.is_ielts_staff()
    or exists (select 1 from public.ielts_attempts a where a.id = attempt_id and a.user_id = auth.uid())
  )
  with check (
    public.is_ielts_staff()
    or exists (select 1 from public.ielts_attempts a where a.id = attempt_id and a.user_id = auth.uid())
  );

create policy ielts_settings_own on public.ielts_student_settings for all
  using (user_id = auth.uid() or public.is_ielts_staff())
  with check (user_id = auth.uid() or public.is_ielts_staff());

create policy ielts_band_read on public.ielts_band_tables for select using (true);
create policy ielts_band_staff on public.ielts_band_tables for all
  using (public.is_ielts_staff()) with check (public.is_ielts_staff());

-- Storage: staff manage media; students own speaking recordings
create policy ielts_media_storage_staff on storage.objects for all
  using (bucket_id = 'ielts-media' and public.is_ielts_staff())
  with check (bucket_id = 'ielts-media' and public.is_ielts_staff());

create policy ielts_media_storage_read on storage.objects for select
  using (bucket_id = 'ielts-media' and public.is_ielts_staff());

create policy ielts_speaking_own on storage.objects for all
  using (
    bucket_id = 'ielts-speaking'
    and (
      public.is_ielts_staff()
      or (storage.foldername(name))[1] = auth.uid()::text
    )
  )
  with check (
    bucket_id = 'ielts-speaking'
    and (
      public.is_ielts_staff()
      or (storage.foldername(name))[1] = auth.uid()::text
    )
  );
