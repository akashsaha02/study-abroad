import { CounselorForm } from "@/components/admin/forms/CounselorForm";
import { createClient } from "@/lib/supabase/server";
import type { Counselor } from "@/types";
import { notFound } from "next/navigation";

export default async function EditCounselorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data } = await supabase.from("counselors").select("*").eq("id", id).single();
  if (!data) notFound();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, email")
    .eq("id", data.profile_id)
    .single();

  const profileOptions = profile ? [profile] : [];

  return <CounselorForm initial={data as Counselor} profileOptions={profileOptions} />;
}
