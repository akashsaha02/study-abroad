import { requireApiRole } from "@/lib/auth/api-auth";
import { createClient } from "@/lib/supabase/server";
import { leadConvertSchema } from "@/lib/validations/admin";
import { NextResponse } from "next/server";
import type { ZodError } from "zod";

const ADMIN_ROLES = ["admin", "super_admin"] as const;

function validationError(error: ZodError) {
  return NextResponse.json({ error: error.flatten() }, { status: 400 });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiRole([...ADMIN_ROLES]);
  if (auth.response) return auth.response;

  const parsed = leadConvertSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);

  const { id: leadId } = await params;
  const supabase = await createClient();

  const { data: lead, error: leadError } = await supabase
    .from("leads")
    .select("*")
    .eq("id", leadId)
    .single();

  if (leadError || !lead) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  if (lead.converted_student_id) {
    return NextResponse.json({ error: "Lead already converted" }, { status: 400 });
  }

  const { profile_id } = parsed.data;
  const now = new Date().toISOString();

  const { data: existingStudent } = await supabase
    .from("students")
    .select("id")
    .eq("profile_id", profile_id)
    .maybeSingle();

  if (existingStudent) {
    const { error: studentError } = await supabase
      .from("students")
      .update({
        lead_id: leadId,
        preferred_country: lead.preferred_country,
        preferred_country_id: lead.preferred_country_id,
        preferred_subject: lead.subject_interest,
        highest_education: lead.education_level,
        budget: lead.budget,
        assigned_counselor_id: lead.assigned_counselor_id,
        updated_at: now,
      })
      .eq("id", existingStudent.id);

    if (studentError) {
      return NextResponse.json({ error: studentError.message }, { status: 500 });
    }
  } else {
    const { error: studentError } = await supabase.from("students").insert({
      profile_id,
      lead_id: leadId,
      preferred_country: lead.preferred_country,
      preferred_country_id: lead.preferred_country_id,
      preferred_subject: lead.subject_interest,
      highest_education: lead.education_level,
      budget: lead.budget,
      assigned_counselor_id: lead.assigned_counselor_id,
    });

    if (studentError) {
      return NextResponse.json({ error: studentError.message }, { status: 500 });
    }
  }

  const { data, error } = await supabase
    .from("leads")
    .update({
      converted_student_id: profile_id,
      status: "converted_to_student",
      updated_at: now,
    })
    .eq("id", leadId)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
