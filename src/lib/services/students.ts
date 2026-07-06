import { createClient } from "@/lib/supabase/server";

export async function getStudentByProfileId(profileId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("students")
    .select("*")
    .eq("profile_id", profileId)
    .single();
  return data;
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
