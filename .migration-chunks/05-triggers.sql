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
