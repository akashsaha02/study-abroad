import { CounselorForm } from "@/components/admin/forms/CounselorForm";
import { createClient } from "@/lib/supabase/server";

export default async function NewCounselorPage() {
  const supabase = await createClient();

  const { data: counselorProfiles } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("role", "counselor")
    .order("full_name");

  const { data: existingCounselors } = await supabase.from("counselors").select("profile_id");
  const usedIds = new Set(existingCounselors?.map((c) => c.profile_id) ?? []);
  const profileOptions = (counselorProfiles ?? []).filter((p) => !usedIds.has(p.id));

  return <CounselorForm profileOptions={profileOptions} />;
}
