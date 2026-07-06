import { createClient } from "@/lib/supabase/server";

export async function getCounselorDashboardData(counselorId: string) {
  const supabase = await createClient();

  const { data: assignedStudents } = await supabase
    .from("students")
    .select("id")
    .eq("assigned_counselor_id", counselorId);

  const studentIds = assignedStudents?.map((s) => s.id) ?? [];

  const [
    leadsRes,
    studentsRes,
    appsRes,
    leads,
    attentionDocs,
    pendingDocsRes,
  ] = await Promise.all([
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("assigned_counselor_id", counselorId),
    supabase
      .from("students")
      .select("id", { count: "exact", head: true })
      .eq("assigned_counselor_id", counselorId),
    supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("counselor_id", counselorId),
    supabase
      .from("leads")
      .select("*")
      .eq("assigned_counselor_id", counselorId)
      .order("created_at", { ascending: false })
      .limit(5),
    studentIds.length > 0
      ? supabase
          .from("documents")
          .select("*, students(profiles(full_name))")
          .in("status", ["needs_update", "rejected"])
          .in("student_id", studentIds)
          .order("uploaded_at", { ascending: false })
          .limit(5)
      : Promise.resolve({ data: [] }),
    studentIds.length > 0
      ? supabase
          .from("documents")
          .select("id", { count: "exact", head: true })
          .eq("status", "pending_review")
          .in("student_id", studentIds)
      : Promise.resolve({ count: 0 }),
  ]);

  return {
    stats: {
      assignedLeads: leadsRes.count ?? 0,
      assignedStudents: studentsRes.count ?? 0,
      applications: appsRes.count ?? 0,
      pendingDocReviews: pendingDocsRes.count ?? 0,
    },
    recentLeads: leads.data ?? [],
    attentionDocuments: attentionDocs.data ?? [],
  };
}

export async function getAdminDashboardData() {
  const supabase = await createClient();

  const [
    leadsRes,
    newLeadsRes,
    studentsRes,
    applicationsRes,
    documentsRes,
    consultationsRes,
    counselorsRes,
    applications,
    pendingDocuments,
  ] = await Promise.all([
    supabase.from("leads").select("id", { count: "exact", head: true }),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("status", "new"),
    supabase.from("students").select("id", { count: "exact", head: true }),
    supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .not("status", "in", '("completed","rejected")'),
    supabase
      .from("documents")
      .select("id", { count: "exact", head: true })
      .eq("status", "pending_review"),
    supabase
      .from("consultations")
      .select("id", { count: "exact", head: true })
      .eq("status", "scheduled"),
    supabase
      .from("profiles")
      .select("id", { count: "exact", head: true })
      .eq("role", "counselor"),
    supabase
      .from("applications")
      .select("*, students(profiles(full_name)), universities(name), countries(name)")
      .order("updated_at", { ascending: false })
      .limit(5),
    supabase
      .from("documents")
      .select("*, students(profiles(full_name))")
      .eq("status", "pending_review")
      .order("uploaded_at", { ascending: false })
      .limit(5),
  ]);

  return {
    stats: {
      totalLeads: leadsRes.count ?? 0,
      newLeads: newLeadsRes.count ?? 0,
      activeStudents: studentsRes.count ?? 0,
      activeApplications: applicationsRes.count ?? 0,
      pendingDocuments: documentsRes.count ?? 0,
      scheduledConsultations: consultationsRes.count ?? 0,
      totalCounselors: counselorsRes.count ?? 0,
    },
    recentApplications: applications.data ?? [],
    pendingDocuments: pendingDocuments.data ?? [],
  };
}
