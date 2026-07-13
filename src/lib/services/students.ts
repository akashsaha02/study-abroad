import { createClient } from "@/lib/supabase/server";
import { tableExists } from "@/lib/countries/fk-guard";

export async function getStudentByProfileId(profileId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("students")
    .select("*")
    .eq("profile_id", profileId)
    .maybeSingle();

  if (!data) return null;

  let preferredCountryIds: string[] = [];
  if (await tableExists(supabase, "student_preferred_countries")) {
    const { data: prefs } = await supabase
      .from("student_preferred_countries")
      .select("country_id")
      .eq("student_id", data.id);
    preferredCountryIds = prefs?.map((p) => p.country_id) ?? [];
  }

  if (preferredCountryIds.length === 0 && data.preferred_country_id) {
    preferredCountryIds = [data.preferred_country_id];
  }

  return {
    ...data,
    preferred_country_ids: preferredCountryIds,
  };
}

export async function getStudentApplications(studentId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("applications")
    .select("*, countries(name), universities(name), courses(title)")
    .eq("student_id", studentId)
    .order("created_at", { ascending: false });
  return data ?? [];
}

export async function getStudentDocuments(studentId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("documents")
    .select("*")
    .eq("student_id", studentId)
    .order("uploaded_at", { ascending: false });
  return data ?? [];
}

export async function getStudentNotifications(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(20);
  return data ?? [];
}

export async function getStudentConsultations(studentId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("consultations")
    .select("*")
    .eq("student_id", studentId)
    .order("scheduled_at", { ascending: false });
  return data ?? [];
}

export async function getStudentByProfileIdForOrder(profileId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("students")
    .select("id")
    .eq("profile_id", profileId)
    .maybeSingle();
  return data;
}
