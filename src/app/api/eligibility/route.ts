import { createLead } from "@/lib/services/leads";
import { eligibilitySchema } from "@/lib/validations/leads";
import { sendNewLeadEmail } from "@/lib/emails/send";
import { NextResponse } from "next/server";

function getRecommendation(data: {
  education_level?: string;
  last_result?: string;
  english_test_score?: string;
  budget?: number;
  preferred_country?: string;
}) {
  const cgpa = parseFloat(data.last_result ?? "0");
  const ielts = parseFloat(data.english_test_score ?? "0");
  const budget = data.budget ?? 0;

  const countries: string[] = [];
  if (budget >= 15000 || cgpa >= 3.5) countries.push("UK", "Canada", "Australia");
  if (budget >= 8000 && budget < 20000) countries.push("Malaysia", "Germany");
  if (budget < 10000) countries.push("Malaysia", "Germany");

  if (data.preferred_country && !countries.includes(data.preferred_country)) {
    countries.unshift(data.preferred_country);
  }

  let studyLevel = "Bachelor's";
  if (data.education_level?.toLowerCase().includes("master")) {
    studyLevel = "Master's";
  } else if (data.education_level?.toLowerCase().includes("phd")) {
    studyLevel = "PhD";
  }

  let universityCategory = "Mid-tier universities";
  if (cgpa >= 3.7 && ielts >= 7) universityCategory = "Top-tier universities";
  else if (cgpa >= 3.0 && ielts >= 6) universityCategory = "Good universities";

  const englishFeedback =
    ielts >= 6.5
      ? "Your English score meets most university requirements."
      : ielts >= 5.5
        ? "Consider retaking IELTS or look at foundation programs."
        : "English test preparation recommended before applying.";

  const budgetFeedback =
    budget >= 20000
      ? "Your budget supports study in UK, Canada, or Australia."
      : budget >= 10000
        ? "Your budget works well for Malaysia, Germany, or mid-tier programs."
        : "Consider scholarship options or more affordable destinations.";

  return {
    recommended_countries: [...new Set(countries)].slice(0, 4),
    study_level: studyLevel,
    university_category: universityCategory,
    english_feedback: englishFeedback,
    budget_feedback: budgetFeedback,
    next_steps: [
      "Book a free consultation with our counselor",
      "Prepare required documents",
      "Shortlist universities based on recommendations",
    ],
  };
}

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

    const recommendation = getRecommendation(parsed.data);

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
      message: `Study level: ${parsed.data.study_level}, Gap years: ${parsed.data.gap_years}`,
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
