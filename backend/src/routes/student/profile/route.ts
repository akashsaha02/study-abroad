import { createClient } from "@/lib/supabase/server";
import { applyFkPayload, detectFkColumns, tableExists } from "@/lib/countries/fk-guard";
import { getCountryNameById, resolveCountryId } from "@/lib/countries/resolve";
import { getUser } from "@/lib/auth/get-user";
import { studentProfileSchema } from "@/lib/validations/student-profile";
import { NextResponse } from "@/lib/http/response";

async function syncPreferredCountries(
  supabase: Awaited<ReturnType<typeof createClient>>,
  studentId: string,
  countryIds: string[]
) {
  if (!(await tableExists(supabase, "student_preferred_countries"))) return;

  await supabase
    .from("student_preferred_countries")
    .delete()
    .eq("student_id", studentId);

  if (countryIds.length === 0) return;

  await supabase.from("student_preferred_countries").insert(
    countryIds.map((country_id) => ({
      student_id: studentId,
      country_id,
    }))
  );
}

export async function PATCH(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const parsed = studentProfileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid input" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const fks = await detectFkColumns(supabase);
  const data = parsed.data;

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
    return NextResponse.json({ error: profileError.message }, { status: 500 });
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
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    const { data: inserted, error } = await supabase
      .from("students")
      .insert(studentData)
      .select("id")
      .single();
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    studentId = inserted.id;
  }

  if (studentId && countryIds.length > 0) {
    await syncPreferredCountries(supabase, studentId, countryIds);
  } else if (studentId && preferredCountryId) {
    await syncPreferredCountries(supabase, studentId, [preferredCountryId]);
  }

  return NextResponse.json({ success: true });
}
