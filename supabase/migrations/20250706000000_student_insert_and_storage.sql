-- Student insert policy + storage buckets

create policy "Students can insert own record" on public.students
  for insert with check (profile_id = auth.uid());

insert into storage.buckets (id, name, public)
values
  ('student-documents', 'student-documents', false),
  ('profile-avatars', 'profile-avatars', true),
  ('university-logos', 'university-logos', true),
  ('blog-images', 'blog-images', true),
  ('testimonial-images', 'testimonial-images', true)
on conflict (id) do nothing;

create policy "Students can upload own documents" on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'student-documents'
    and (storage.foldername(name))[1] in (
      select id::text from public.students where profile_id = auth.uid()
    )
  );

create policy "Students can read own documents" on storage.objects
  for select to authenticated
  using (
    bucket_id = 'student-documents'
    and (storage.foldername(name))[1] in (
      select id::text from public.students where profile_id = auth.uid()
    )
  );

create policy "Admins can manage student documents storage" on storage.objects
  for all to authenticated
  using (
    bucket_id = 'student-documents'
    and public.get_user_role() in ('admin', 'super_admin', 'counselor')
  )
  with check (
    bucket_id = 'student-documents'
    and public.get_user_role() in ('admin', 'super_admin', 'counselor')
  );

create policy "Public can read public buckets" on storage.objects
  for select to public
  using (bucket_id in ('profile-avatars', 'university-logos', 'blog-images', 'testimonial-images'));

create policy "Admins can manage public buckets" on storage.objects
  for all to authenticated
  using (
    bucket_id in ('profile-avatars', 'university-logos', 'blog-images', 'testimonial-images')
    and public.get_user_role() in ('admin', 'super_admin')
  )
  with check (
    bucket_id in ('profile-avatars', 'university-logos', 'blog-images', 'testimonial-images')
    and public.get_user_role() in ('admin', 'super_admin')
  );
