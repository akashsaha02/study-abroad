import { createClient } from "@/lib/supabase/server";
import { SERVICES } from "@/constants";
import type { Service } from "@/types";

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
  countryId?: string;
  universityId?: string;
  degreeLevel?: string;
  subjectArea?: string;
}) {
  const supabase = await createClient();
  let query = supabase
    .from("courses")
    .select("*, universities(name, slug, country_id, countries(name, slug))")
    .eq("is_published", true)
    .order("title");

  if (filters?.countryId) query = query.eq("universities.country_id", filters.countryId);
  if (filters?.universityId) query = query.eq("university_id", filters.universityId);
  if (filters?.degreeLevel) query = query.eq("degree_level", filters.degreeLevel);
  if (filters?.subjectArea) query = query.eq("subject_area", filters.subjectArea);

  const { data } = await query;
  return data ?? [];
}

export async function getCourseBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("*, universities(name, slug, country_id, countries(name, slug))")
    .eq("slug", slug)
    .eq("is_published", true)
    .limit(1)
    .maybeSingle();
  return data;
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

export async function getEligibilityRules() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("eligibility_rules")
    .select("*")
    .eq("is_active", true)
    .order("country");
  return data ?? [];
}

export async function getPublishedTestimonials() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_published", true)
    .order("created_at", { ascending: false })
    .limit(6);
  return data ?? [];
}

export async function getPublishedServices(): Promise<Service[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .eq("is_published", true)
    .order("sort_order");

  if (!error && data && data.length > 0) {
    return data as Service[];
  }

  return SERVICES.map((service, index) => ({
    id: service.slug,
    slug: service.slug,
    title: service.title,
    description: service.description,
    price: 0,
    discount_percent: 0,
    sort_order: index,
    is_published: true,
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
  }));
}

export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("services")
    .select("*")
    .eq("slug", slug)
    .eq("is_published", true)
    .maybeSingle();

  if (data) return data as Service;

  const fallback = SERVICES.find((s) => s.slug === slug);
  if (!fallback) return null;

  return {
    id: fallback.slug,
    slug: fallback.slug,
    title: fallback.title,
    description: fallback.description,
    price: 0,
    discount_percent: 0,
    sort_order: 0,
    is_published: true,
    created_at: new Date(0).toISOString(),
    updated_at: new Date(0).toISOString(),
  };
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
