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
