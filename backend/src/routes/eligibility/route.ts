import { createLead } from "@/lib/services/leads";
import { buildEligibilityRecommendation } from "@/lib/eligibility/recommend";
import { getEligibilityRules } from "@/lib/services/content";
import { eligibilitySchema } from "@/lib/validations/leads";
import { sendNewLeadEmail } from "@/lib/emails/send";
import { NextResponse } from "@/lib/http/response";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = eligibilitySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message },
        { status: 400 }
      );
    }

    const rules = await getEligibilityRules();
    const recommendation = buildEligibilityRecommendation(parsed.data, rules);

    const lead = await createLead({
      name: parsed.data.name,
      email: parsed.data.email || undefined,
      phone: parsed.data.phone,
      preferred_country: parsed.data.preferred_country,
      preferred_country_id: parsed.data.preferred_country_id,
      education_level: parsed.data.education_level,
      subject_interest: parsed.data.preferred_subject,
      last_result: parsed.data.last_result,
      ielts_score: parsed.data.english_test_score
        ? parseFloat(parsed.data.english_test_score)
        : undefined,
      budget: parsed.data.budget,
      message: [
        parsed.data.study_level && `Intended level: ${parsed.data.study_level}`,
        parsed.data.gap_years != null && `Gap years: ${parsed.data.gap_years}`,
        parsed.data.english_test_type &&
          `English test: ${parsed.data.english_test_type}`,
      ]
        .filter(Boolean)
        .join(" · "),
      source: "eligibility_checker",
    });

    if (lead) {
      await sendNewLeadEmail(lead);
    }

    return NextResponse.json({ recommendation, leadId: lead?.id });
  } catch {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
