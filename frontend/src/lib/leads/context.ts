import { createClient } from "@/lib/supabase/server";

export interface LeadContextDefaults {
  name?: string;
  email?: string;
  phone?: string;
  countryId?: string;
  countrySlug?: string;
  message?: string;
  universityId?: string;
  universitySlug?: string;
  universityName?: string;
  courseId?: string;
  courseSlug?: string;
  courseTitle?: string;
  serviceSlug?: string;
  serviceTitle?: string;
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
