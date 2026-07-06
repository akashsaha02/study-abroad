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