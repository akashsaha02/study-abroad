-- Allow staff to SELECT notifications (needed for INSERT ... RETURNING / .select() after insert)
create policy "Staff can read all notifications"
  on public.notifications
  for select
  using (public.get_user_role() in ('admin', 'super_admin', 'counselor'));
