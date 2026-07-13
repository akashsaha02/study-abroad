import { createClient } from "@/lib/supabase/server";
import { applyFkPayload, detectFkColumns } from "@/lib/countries/fk-guard";
import { getCountryNameById, resolveCountryId } from "@/lib/countries/resolve";
import type { Lead, LeadSource } from "@/types";

export interface CreateLeadInput {
  name: string;
  email?: string;
  phone: string;
  preferred_country?: string;
  preferred_country_id?: string;
  education_level?: string;
  subject_interest?: string;
  last_result?: string;
  ielts_score?: number;
  budget?: number;
  message?: string;
  source?: LeadSource;
  university_id?: string;
  course_id?: string;
  service_slug?: string;
}

export async function createLead(input: CreateLeadInput): Promise<Lead | null> {
  const supabase = await createClient();
  const fks = await detectFkColumns(supabase);
  const id = crypto.randomUUID();
  const source = input.source ?? "website";
  const now = new Date().toISOString();

  const preferredCountryId = await resolveCountryId(supabase, {
    countryId: input.preferred_country_id,
    countryName: input.preferred_country,
  });
  const preferredCountry =
    (preferredCountryId ? await getCountryNameById(supabase, preferredCountryId) : null) ??
    input.preferred_country ??
    null;

  let payload = {
    id,
    name: input.name,
    email: input.email,
    phone: input.phone,
    preferred_country: preferredCountry,
    preferred_country_id: preferredCountryId,
    education_level: input.education_level,
    subject_interest: input.subject_interest,
    last_result: input.last_result,
    ielts_score: input.ielts_score,
    budget: input.budget,
    message: input.message,
    source,
    university_id: input.university_id ?? null,
    course_id: input.course_id ?? null,
    service_slug: input.service_slug ?? null,
  };

  payload = applyFkPayload(fks, payload, [
    ["leads", "preferred_country_id"],
    ["leads", "university_id"],
    ["leads", "course_id"],
    ["leads", "service_slug"],
  ]);

  const { error } = await supabase.from("leads").insert(payload);

  if (error) {
    console.error("Failed to create lead:", error);
    return null;
  }

  return {
    id,
    name: input.name,
    email: input.email ?? null,
    phone: input.phone,
    preferred_country: preferredCountry,
    preferred_country_id: preferredCountryId,
    education_level: input.education_level ?? null,
    subject_interest: input.subject_interest ?? null,
    last_result: input.last_result ?? null,
    ielts_score: input.ielts_score ?? null,
    budget: input.budget ?? null,
    message: input.message ?? null,
    source,
    status: "new",
    assigned_counselor_id: null,
    converted_student_id: null,
    university_id: input.university_id ?? null,
    course_id: input.course_id ?? null,
    service_slug: input.service_slug ?? null,
    created_at: now,
    updated_at: now,
  };
}

export async function getLeads(filters?: {
  status?: string;
  source?: string;
  assignedCounselorId?: string;
}) {
  const supabase = await createClient();
  let query = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.source) query = query.eq("source", filters.source);
  if (filters?.assignedCounselorId) {
    query = query.eq("assigned_counselor_id", filters.assignedCounselorId);
  }

  const { data } = await query;
  return data ?? [];
}

export async function getLeadById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("leads").select("*").eq("id", id).single();
  return data;
}

export async function updateLeadStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  return !error;
}

export async function assignLead(id: string, counselorId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({
      assigned_counselor_id: counselorId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  return !error;
}
