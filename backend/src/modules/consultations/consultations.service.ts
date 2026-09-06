import { createLead, sendNewLeadEmail } from "@/modules/leads";
import { getUser } from "@/modules/identity";
import { createClient } from "@/infrastructure/supabase/client";
import { AppError } from "@/shared/http/errors";
import type { ConsultationRequestInput } from "@abroadly/shared/validations/consultation-request";

export async function createConsultationRequest(data: ConsultationRequestInput) {
  const user = await getUser();

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
    throw new AppError("Failed to save request", 500);
  }

  const supabase = createClient();
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
    throw new AppError(consultationError.message, 500);
  }

  await sendNewLeadEmail(lead);
  return lead;
}
