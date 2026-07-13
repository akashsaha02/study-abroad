import { createLead } from "@/lib/services/leads";
import { consultationRequestSchema } from "@/lib/validations/consultation-request";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";
import { sendNewLeadEmail } from "@/lib/emails/send";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = consultationRequestSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Invalid input" },
        { status: 400 }
      );
    }

    const user = await getUser();
    const data = parsed.data;

    const lead = await createLead({
      name: data.name,
      email: data.email || undefined,
      phone: data.phone,
      preferred_country_id: data.preferred_country_id,
      preferred_country: data.preferred_country,
      message: data.notes,
      university_id: data.university_id,
      course_id: data.course_id,
      service_slug: data.service_slug,
      source: "consultation_request",
    });

    if (!lead) {
      return NextResponse.json({ error: "Failed to save request" }, { status: 500 });
    }

    const supabase = await createClient();
    let studentId: string | null = null;
    if (user) {
      const { data: student } = await supabase
        .from("students")
        .select("id")
        .eq("profile_id", user.id)
        .maybeSingle();
      studentId = student?.id ?? null;
    }

    const { error: consultationError } = await supabase.from("consultations").insert({
      lead_id: lead.id,
      student_id: studentId,
      requested_date: data.requested_date || null,
      notes: data.notes || null,
      status: "requested",
    });

    if (consultationError) {
      return NextResponse.json({ error: consultationError.message }, { status: 500 });
    }

    await sendNewLeadEmail(lead);

    return NextResponse.json({ success: true, id: lead.id });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
