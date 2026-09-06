import { applyFkPayload, detectFkColumns } from "@abroadly/shared/countries/fk-guard";
import { getCountryNameById, resolveCountryId } from "@abroadly/shared/countries/resolve";
import { LEAD_STATUSES } from "@abroadly/shared/constants";
import { createClient } from "@/infrastructure/supabase/client";
import { AppError, NotFoundError, ValidationError } from "@/shared/http/errors";
import { sendNewLeadEmail } from "@/modules/leads/leads.email";
import type { Lead, LeadStatus } from "@abroadly/shared/types";
import type {
  ConvertLeadInput,
  CreateLeadInput,
  LeadContextDefaults,
} from "@/modules/leads/leads.types";

const LEAD_STATUS_SET = new Set<string>(LEAD_STATUSES);

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

export async function createLeadAndNotify(input: CreateLeadInput): Promise<Lead | null> {
  const lead = await createLead(input);
  if (lead) {
    await sendNewLeadEmail(lead);
  }
  return lead;
}

export async function assignLead(id: string, counselorId: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .update({
      assigned_counselor_id: counselorId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id")
    .single();

  if (error) throw new AppError("Failed to assign lead", 500);
  if (!data) throw new NotFoundError("Lead not found");
  return data;
}

export async function updateLeadStatus(id: string, status: unknown) {
  if (typeof status !== "string" || !LEAD_STATUS_SET.has(status)) {
    throw new ValidationError("Invalid lead status");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .update({ status: status as LeadStatus, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id")
    .single();

  if (error) throw new AppError("Failed to update lead", 500);
  if (!data) throw new NotFoundError("Lead not found");
  return data;
}

export async function convertLead({
  leadId,
  profileId,
  convertedBy,
}: ConvertLeadInput) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("convert_lead", {
    p_lead_id: leadId,
    p_profile_id: profileId,
    p_converted_by: convertedBy ?? null,
  });

  if (!error) {
    return { id: leadId, student_id: data as string };
  }

  const message = error.message ?? "";
  if (/already converted/i.test(message)) {
    throw new AppError("Lead already converted", 400);
  }
  if (/not found/i.test(message)) {
    throw new NotFoundError("Lead not found");
  }
  if (/forbidden/i.test(message)) {
    throw new AppError("Forbidden", 403);
  }

  if (/does not exist|schema cache/i.test(message)) {
    return convertLeadFallback({ leadId, profileId, convertedBy });
  }

  throw new AppError("Failed to convert lead", 500);
}

async function convertLeadFallback({
  leadId,
  profileId,
}: ConvertLeadInput) {
  const supabase = await createClient();

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("*")
    .eq("id", leadId)
    .single();

  if (leadError || !lead) {
    throw new NotFoundError("Lead not found");
  }

  if (lead.converted_student_id) {
    throw new AppError("Lead already converted", 400);
  }

  const now = new Date().toISOString();

  const { data: existingStudent } = await supabase
    .from("students")
    .select("id")
    .eq("profile_id", profileId)
    .maybeSingle();

  const studentFields = {
    lead_id: leadId,
    preferred_country: lead.preferred_country,
    preferred_country_id: lead.preferred_country_id,
    preferred_subject: lead.subject_interest,
    highest_education: lead.education_level,
    cgpa: lead.last_result,
    english_test_score: lead.ielts_score?.toString() ?? null,
    budget: lead.budget,
    assigned_counselor_id: lead.assigned_counselor_id,
    updated_at: now,
  };

  let studentId = existingStudent?.id as string | undefined;

  if (existingStudent) {
    const { error: studentError } = await supabase
      .from("students")
      .update(studentFields)
      .eq("id", existingStudent.id);

    if (studentError) {
      throw new AppError("Failed to convert lead", 500);
    }
  } else {
    const { data: inserted, error: studentError } = await supabase
      .from("students")
      .insert({
        profile_id: profileId,
        ...studentFields,
      })
      .select("id")
      .single();

    if (studentError || !inserted) {
      throw new AppError("Failed to convert lead", 500);
    }
    studentId = inserted.id;
  }

  const { data, error } = await supabase
    .from("leads")
    .update({
      converted_student_id: studentId,
      status: "converted_to_student",
      updated_at: now,
    })
    .eq("id", leadId)
    .is("converted_student_id", null)
    .select("id")
    .single();

  if (error || !data) {
    throw new AppError("Lead already converted", 400);
  }

  return { id: data.id, student_id: studentId };
}

export async function resolveLeadContextFromSlugs(params: {
  university?: string | null;
  course?: string | null;
  service?: string | null;
  country?: string | null;
  message?: string | null;
}): Promise<LeadContextDefaults> {
  const supabase = await createClient();
  const result: LeadContextDefaults = {};

  if (params.message) {
    result.message = params.message;
  }

  if (params.country) {
    const { data: country } = await supabase
      .from("countries")
      .select("id, name, slug")
      .eq("slug", params.country)
      .maybeSingle();
    if (country) {
      result.countryId = country.id;
      result.countrySlug = country.slug;
    }
  }

  if (params.university) {
    const { data: university } = await supabase
      .from("universities")
      .select("id, name, slug, country_id, countries(slug)")
      .eq("slug", params.university)
      .maybeSingle();
    if (university) {
      result.universityId = university.id;
      result.universitySlug = university.slug;
      result.universityName = university.name;
      if (!result.countryId && university.country_id) {
        result.countryId = university.country_id;
      }
      const countryRel = university.countries as { slug?: string } | null;
      if (countryRel?.slug) result.countrySlug = countryRel.slug;
      if (!result.message) {
        result.message = `I'm interested in applying to ${university.name}.`;
      }
    }
  }

  if (params.course) {
    const { data: course } = await supabase
      .from("courses")
      .select("id, title, slug, university_id, universities(name, slug, country_id)")
      .eq("slug", params.course)
      .maybeSingle();
    if (course) {
      result.courseId = course.id;
      result.courseSlug = course.slug;
      result.courseTitle = course.title;
      const uni = course.universities as {
        name?: string;
        slug?: string;
        country_id?: string;
      } | null;
      if (uni?.name) {
        result.universityName = uni.name;
        if (!result.message) {
          result.message = `I'm interested in the ${course.title} program at ${uni.name}.`;
        }
      }
      if (!result.countryId && uni?.country_id) {
        result.countryId = uni.country_id;
      }
    }
  }

  if (params.service) {
    const { data: service } = await supabase
      .from("services")
      .select("slug, title")
      .eq("slug", params.service)
      .maybeSingle();
    if (service) {
      result.serviceSlug = service.slug;
      result.serviceTitle = service.title;
      if (!result.message) {
        result.message = `I'd like to learn more about ${service.title}.`;
      }
    } else {
      result.serviceSlug = params.service;
      if (!result.message) {
        result.message = `I'd like to learn more about ${params.service.replace(/-/g, " ")}.`;
      }
    }
  }

  return result;
}
