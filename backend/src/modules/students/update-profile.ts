import { createClient } from "@/infrastructure/supabase/client";
import { applyFkPayload, detectFkColumns, tableExists } from "@abroadly/shared/countries/fk-guard";
import { getCountryNameById, resolveCountryId } from "@abroadly/shared/countries/resolve";
import type { StudentProfileInput } from "@abroadly/shared/validations/student-profile";
import type { AuthUser } from "@abroadly/shared/types";

export type UpdateProfileResult =
  | { ok: true }
  | { ok: false; status: number; error: string };

async function syncPreferredCountries(
  supabase: Awaited<ReturnType<typeof createClient>>,
  studentId: string,
  countryIds: string[]
) {
  if (!(await tableExists(supabase, "student_preferred_countries"))) return;

  const { error: deleteError } = await supabase
    .from("student_preferred_countries")
    .delete()
    .eq("student_id", studentId);
  if (deleteError) {
    throw new Error(deleteError.message);
  }

  if (countryIds.length === 0) return;

  const { error: insertError } = await supabase.from("student_preferred_countries").insert(
    countryIds.map((country_id) => ({
      student_id: studentId,
      country_id,
    }))
  );
  if (insertError) {
    throw new Error(insertError.message);
  }
}

export async function updateStudentProfile(
  user: AuthUser,
  data: StudentProfileInput
): Promise<UpdateProfileResult> {
  const supabase = await createClient();
  const fks = await detectFkColumns(supabase);

  const countryIds = data.preferred_country_ids ?? [];
  const primaryCountryId =
    countryIds[0] ??
    (data.preferred_country_id
      ? data.preferred_country_id
      : await resolveCountryId(supabase, {
          countryId: data.preferred_country_id,
          countryName: data.preferred_country,
        }));

  const preferredCountryId = primaryCountryId ?? null;
  const preferredCountry =
    (preferredCountryId
      ? await getCountryNameById(supabase, preferredCountryId)
      : null) ??
    data.preferred_country ??
    null;

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: data.full_name,
      phone: data.phone,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (profileError) {
    return { ok: false, status: 500, error: profileError.message };
  }

  const { data: existingStudent } = await supabase
    .from("students")
    .select("id")
    .eq("profile_id", user.id)
    .maybeSingle();

  let studentData = {
    profile_id: user.id,
    nationality: data.nationality,
    date_of_birth: data.date_of_birth || null,
    highest_education: data.highest_education,
    institution_name: data.institution_name,
    cgpa: data.cgpa,
    english_test_type: data.english_test_type,
    english_test_score: data.english_test_score,
    preferred_country: preferredCountry,
    preferred_country_id: preferredCountryId,
    preferred_subject: data.preferred_subject,
    current_address: data.current_address,
    updated_at: new Date().toISOString(),
  };

  studentData = applyFkPayload(fks, studentData, [
    ["students", "preferred_country_id"],
  ]);

  let studentId = existingStudent?.id;

  if (existingStudent) {
    const { error } = await supabase
      .from("students")
      .update(studentData)
      .eq("id", existingStudent.id);
    if (error) {
      return { ok: false, status: 500, error: error.message };
    }
  } else {
    const { data: inserted, error } = await supabase
      .from("students")
      .insert(studentData)
      .select("id")
      .single();
    if (error) {
      return { ok: false, status: 500, error: error.message };
    }
    studentId = inserted.id;
  }

  if (studentId) {
    try {
      await syncPreferredCountries(
        supabase,
        studentId,
        countryIds.length > 0
          ? countryIds
          : preferredCountryId
            ? [preferredCountryId]
            : []
      );
    } catch (err) {
      return {
        ok: false,
        status: 500,
        error: err instanceof Error ? err.message : "Failed to save preferred countries",
      };
    }
  }

  return { ok: true };
}

export async function getStudentByProfileIdForOrder(profileId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("students")
    .select("id")
    .eq("profile_id", profileId)
    .maybeSingle();
  return data;
}
