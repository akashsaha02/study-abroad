import {
  APPLICATIONS_WITH_STUDENT,
  DOCUMENTS_WITH_STUDENT,
} from "@/lib/supabase/embeds";
import { createClient } from "@/lib/supabase/server";

export interface ChartDataPoint {
  name: string;
  value: number;
}

export interface TrendDataPoint {
  date: string;
  count: number;
}

function countByField<T extends Record<string, unknown>>(
  items: T[],
  field: keyof T
): ChartDataPoint[] {
  const counts = new Map<string, number>();
  for (const item of items) {
    const key = String(item[field] ?? "unknown");
    counts.set(key, (counts.get(key) ?? 0) + 1);
  }
  return Array.from(counts.entries()).map(([name, value]) => ({ name, value }));
}

function buildTrendData(
  items: { created_at?: string | null }[],
  days = 30
): TrendDataPoint[] {
  const now = new Date();
  const start = new Date(now);
  start.setDate(start.getDate() - (days - 1));

  const buckets = new Map<string, number>();
  for (let i = 0; i < days; i++) {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    buckets.set(d.toISOString().slice(0, 10), 0);
  }

  for (const item of items) {
    if (!item.created_at) continue;
    const key = item.created_at.slice(0, 10);
    if (buckets.has(key)) {
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }
  }

  return Array.from(buckets.entries()).map(([date, count]) => ({ date, count }));
}

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
          .select(DOCUMENTS_WITH_STUDENT)
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
    recentLeads,
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
      .select(APPLICATIONS_WITH_STUDENT)
      .order("updated_at", { ascending: false })
      .limit(5),
    supabase
      .from("documents")
      .select(DOCUMENTS_WITH_STUDENT)
      .eq("status", "pending_review")
      .order("uploaded_at", { ascending: false })
      .limit(5),
    supabase
      .from("leads")
      .select("*")
      .order("created_at", { ascending: false })
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
    recentLeads: recentLeads.data ?? [],
  };
}

export async function getAdminChartData() {
  const supabase = await createClient();
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const [leadsRes, applicationsRes, documentsRes] = await Promise.all([
    supabase.from("leads").select("status, source, created_at").gte("created_at", since.toISOString()),
    supabase.from("applications").select("status"),
    supabase.from("documents").select("status"),
  ]);

  const leads = leadsRes.data ?? [];
  return {
    leadsTrend: buildTrendData(leads),
    leadStatus: countByField(leads, "status"),
    leadSource: countByField(leads, "source"),
    applicationStatus: countByField(applicationsRes.data ?? [], "status"),
    documentStatus: countByField(documentsRes.data ?? [], "status"),
  };
}

export async function getCounselorChartData(counselorId: string) {
  const supabase = await createClient();
  const since = new Date();
  since.setDate(since.getDate() - 30);

  const { data: assignedStudents } = await supabase
    .from("students")
    .select("id")
    .eq("assigned_counselor_id", counselorId);
  const studentIds = assignedStudents?.map((s) => s.id) ?? [];

  const [leadsRes, applicationsRes, documentsRes] = await Promise.all([
    supabase
      .from("leads")
      .select("status, source, created_at")
      .eq("assigned_counselor_id", counselorId)
      .gte("created_at", since.toISOString()),
    supabase.from("applications").select("status").eq("counselor_id", counselorId),
    studentIds.length > 0
      ? supabase.from("documents").select("status").in("student_id", studentIds)
      : Promise.resolve({ data: [] }),
  ]);

  const leads = leadsRes.data ?? [];
  return {
    leadsTrend: buildTrendData(leads),
    leadStatus: countByField(leads, "status"),
    leadSource: countByField(leads, "source"),
    applicationStatus: countByField(applicationsRes.data ?? [], "status"),
    documentStatus: countByField(documentsRes.data ?? [], "status"),
  };
}
