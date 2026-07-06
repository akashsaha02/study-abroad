import { ConsultationForm } from "@/components/admin/forms/ConsultationForm";
import { createClient } from "@/lib/supabase/server";

export default async function NewConsultationPage() {
  const supabase = await createClient();

  const [{ data: leads }, { data: students }, { data: counselors }] = await Promise.all([
    supabase.from("leads").select("id, name").order("name"),
    supabase
      .from("students")
      .select("id, profiles(full_name, email)")
      .order("created_at", { ascending: false }),
    supabase
      .from("counselors")
      .select("profile_id, profiles(full_name)")
      .eq("is_active", true),
  ]);

  const studentOptions = (students ?? []).map((s) => ({
    id: s.id,
    label:
      (s.profiles as { full_name?: string; email?: string })?.full_name ??
      (s.profiles as { email?: string })?.email ??
      s.id,
  }));

  const counselorOptions = (counselors ?? []).map((c) => ({
    profile_id: c.profile_id,
    name: (c.profiles as { full_name?: string })?.full_name ?? c.profile_id,
  }));

  return (
    <ConsultationForm
      leads={leads ?? []}
      students={studentOptions}
      counselors={counselorOptions}
    />
  );
}
