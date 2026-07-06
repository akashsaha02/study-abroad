import { createClient } from "@/lib/supabase/server";
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
}

export async function createLead(input: CreateLeadInput): Promise<Lead | null> {
  const supabase = await createClient();
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

  const { error } = await supabase.from("leads").insert({
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
  });

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
    created_at: now,
    updated_at: now,
  };
}

export async function getLeads(filters?: {
  status?: string;
  source?: string;
  country?: string;
  countryId?: string;
}) {
  const supabase = await createClient();
  let query = supabase
    .from("leads")
    .select("*")
    .order("created_at", { ascending: false });

  if (filters?.status) query = query.eq("status", filters.status);
  if (filters?.source) query = query.eq("source", filters.source);
  if (filters?.countryId) query = query.eq("preferred_country_id", filters.countryId);
  else if (filters?.country) query = query.eq("preferred_country", filters.country);

  const { data, error } = await query;
  if (error) return [];
  return data as Lead[];
}

export async function getLeadById(id: string) {
  const supabase = await createClient();
  const { data } = await supabase.from("leads").select("*").eq("id", id).single();
  return data as Lead | null;
}

export async function updateLeadStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", id);
  return !error;
}

export async function assignCounselor(leadId: string, counselorId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("leads")
    .update({ assigned_counselor_id: counselorId })
    .eq("id", leadId);
  return !error;
}
