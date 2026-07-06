import { createClient } from "@/lib/supabase/server";

export async function getPublishedCountries() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("countries")
    .select("*")
    .eq("is_published", true)
    .order("name");
  return data ?? [];
}

export async function getCountryBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("countries")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return data;
}

export async function getPublishedUniversities(filters?: {
  countryId?: string;
  featured?: boolean;
}) {
  const supabase = await createClient();
  let query = supabase
    .from("universities")
    .select("*, countries(name, slug)")
    .eq("is_published", true)
    .order("name");

  if (filters?.countryId) query = query.eq("country_id", filters.countryId);
  if (filters?.featured) query = query.eq("is_featured", true);

  const { data } = await query;
  return data ?? [];
}

export async function getUniversityBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("universities")
    .select("*, countries(name, slug)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return data;
}

export async function getPublishedCourses(filters?: {
  universityId?: string;
  degreeLevel?: string;
  subjectArea?: string;
}) {
  const supabase = await createClient();
  let query = supabase
    .from("courses")
    .select("*, universities(name, slug, countries(name, slug))")
    .eq("is_published", true)
    .order("title");

  if (filters?.universityId) query = query.eq("university_id", filters.universityId);
  if (filters?.degreeLevel) query = query.eq("degree_level", filters.degreeLevel);
  if (filters?.subjectArea) query = query.eq("subject_area", filters.subjectArea);

  const { data } = await query;
  return data ?? [];
}

export async function getPublishedScholarships() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("scholarships")
    .select("*, countries(name, slug), universities(name, slug)")
    .eq("is_published", true)
    .order("deadline");
  return data ?? [];
}

export async function getPublishedBlogPosts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("is_published", true)
    .order("published_at", { ascending: false });
  return data ?? [];
}

export async function getBlogPostBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  return data;
}

export async function getCostSettings() {
  const supabase = await createClient();
  const { data } = await supabase.from("cost_settings").select("*");
  return data ?? [];
}

export async function getAdminStats() {
  const supabase = await createClient();

  const [
    leadsRes,
    newLeadsRes,
    studentsRes,
    applicationsRes,
    documentsRes,
    consultationsRes,
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
  ]);

  return {
    totalLeads: leadsRes.count ?? 0,
    newLeads: newLeadsRes.count ?? 0,
    activeStudents: studentsRes.count ?? 0,
    activeApplications: applicationsRes.count ?? 0,
    pendingDocuments: documentsRes.count ?? 0,
    scheduledConsultations: consultationsRes.count ?? 0,
  };
}
