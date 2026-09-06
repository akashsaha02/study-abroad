import { createClient } from "@/infrastructure/supabase/client";
import { createLeadAndNotify } from "@/modules/leads";
import { buildEligibilityRecommendation } from "@abroadly/shared/eligibility";
import type { EligibilityInput } from "@abroadly/shared/validations/leads";

export async function getEligibilityRules() {
  const supabase = createClient();
  const { data } = await supabase
    .from("eligibility_rules")
    .select("*")
    .eq("is_active", true)
    .order("country");
  return data ?? [];
}

export async function checkEligibility(input: EligibilityInput) {
  const rules = await getEligibilityRules();
  const recommendation = buildEligibilityRecommendation(input, rules);

  const lead = await createLeadAndNotify({
    name: input.name,
    email: input.email || undefined,
    phone: input.phone,
    preferred_country: input.preferred_country,
    preferred_country_id: input.preferred_country_id,
    education_level: input.education_level,
    subject_interest: input.preferred_subject,
    last_result: input.last_result,
    ielts_score: input.english_test_score
      ? parseFloat(input.english_test_score)
      : undefined,
    budget: input.budget,
    message: [
      input.study_level && `Intended level: ${input.study_level}`,
      input.gap_years != null && `Gap years: ${input.gap_years}`,
      input.english_test_type && `English test: ${input.english_test_type}`,
    ]
      .filter(Boolean)
      .join(" · "),
    source: "eligibility_checker",
  });

  return { recommendation, leadId: lead?.id };
}
