import type { SupabaseClient } from "@supabase/supabase-js";

export interface ApplicationTargets {
  country_id?: string | null;
  university_id?: string | null;
  course_id?: string | null;
}

export async function validateApplicationTargets(
  supabase: SupabaseClient,
  targets: ApplicationTargets
): Promise<{ ok: true; data: ApplicationTargets } | { ok: false; error: string }> {
  const { country_id, university_id, course_id } = targets;

  if (course_id) {
    const { data: course } = await supabase
      .from("courses")
      .select("id, university_id, universities(country_id)")
      .eq("id", course_id)
      .maybeSingle();

    if (!course) {
      return { ok: false, error: "Selected course not found" };
    }

    const courseUniversityId = course.university_id as string;
    const courseCountryId = (course.universities as { country_id?: string })?.country_id;

    if (university_id && university_id !== courseUniversityId) {
      return { ok: false, error: "Course does not belong to the selected university" };
    }

    if (country_id && courseCountryId && country_id !== courseCountryId) {
      return { ok: false, error: "Course does not belong to the selected country" };
    }

    return {
      ok: true,
      data: {
        country_id: country_id ?? courseCountryId ?? null,
        university_id: university_id ?? courseUniversityId,
        course_id,
      },
    };
  }

  if (university_id) {
    const { data: university } = await supabase
      .from("universities")
      .select("id, country_id")
      .eq("id", university_id)
      .maybeSingle();

    if (!university) {
      return { ok: false, error: "Selected university not found" };
    }

    if (country_id && country_id !== university.country_id) {
      return { ok: false, error: "University does not belong to the selected country" };
    }

    return {
      ok: true,
      data: {
        country_id: country_id ?? university.country_id,
        university_id,
        course_id: null,
      },
    };
  }

  return {
    ok: true,
    data: { country_id: country_id ?? null, university_id: null, course_id: null },
  };
}
