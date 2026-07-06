import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const supabase = await createClient();

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      full_name: body.full_name,
      phone: body.phone,
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
    .single();

  const studentData = {
    profile_id: user.id,
    nationality: body.nationality,
    date_of_birth: body.date_of_birth || null,
    highest_education: body.highest_education,
    institution_name: body.institution_name,
    cgpa: body.cgpa,
    english_test_type: body.english_test_type,
    english_test_score: body.english_test_score,
    preferred_country: body.preferred_country,
    preferred_subject: body.preferred_subject,
    current_address: body.current_address,
    updated_at: new Date().toISOString(),
  };

  if (existingStudent) {
    const { error } = await supabase
      .from("students")
      .update(studentData)
      .eq("id", existingStudent.id);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  } else {
    const { error } = await supabase.from("students").insert(studentData);
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

  return NextResponse.json({ success: true });
}
