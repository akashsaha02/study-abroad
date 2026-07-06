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