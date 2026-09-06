import type { EligibilityRule } from "../types";

export interface EligibilityRecommendInput {
  education_level?: string;
  last_result?: string;
  english_test_score?: string;
  budget?: number;
  preferred_country?: string;
  preferred_country_id?: string;
  study_level?: string;
}

export interface EligibilityRecommendation {
  recommended_countries: string[];
  study_level: string;
  university_category: string;
  english_feedback: string;
  budget_feedback: string;
  next_steps: string[];
  matched_rules?: string[];
}

function fallbackRecommendation(
  data: EligibilityRecommendInput
): EligibilityRecommendation {
  const cgpa = parseFloat(data.last_result ?? "0");
  const ielts = parseFloat(data.english_test_score ?? "0");
  const budget = data.budget ?? 0;

  const countries: string[] = [];
  if (budget >= 15000 || cgpa >= 3.5) countries.push("United Kingdom", "Canada", "Australia");
  if (budget >= 8000 && budget < 20000) countries.push("Malaysia", "Germany");
  if (budget < 10000) countries.push("Malaysia", "Germany");

  if (data.preferred_country && !countries.includes(data.preferred_country)) {
    countries.unshift(data.preferred_country);
  }

  let studyLevel = data.study_level || "Bachelor's";
  if (!data.study_level) {
    if (data.education_level?.toLowerCase().includes("master")) {
      studyLevel = "Master's";
    } else if (data.education_level?.toLowerCase().includes("phd")) {
      studyLevel = "PhD";
    }
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

function normalize(value: string | null | undefined) {
  return value?.trim().toLowerCase() ?? "";
}

function countryMatches(
  rule: EligibilityRule,
  data: EligibilityRecommendInput
): boolean {
  if (data.preferred_country_id && rule.country_id) {
    return data.preferred_country_id === rule.country_id;
  }
  if (data.preferred_country && rule.country) {
    return normalize(rule.country) === normalize(data.preferred_country);
  }
  return false;
}

function educationMatches(rule: EligibilityRule, data: EligibilityRecommendInput) {
  if (!data.education_level || !rule.education_level) return true;
  return normalize(data.education_level) === normalize(rule.education_level);
}

/** Build a recommendation from admin eligibility rules, with hardcoded fallback. */
export function buildEligibilityRecommendation(
  data: EligibilityRecommendInput,
  rules: EligibilityRule[] = []
): EligibilityRecommendation {
  const activeRules = rules.filter((r) => r.is_active);
  if (activeRules.length === 0) {
    return fallbackRecommendation(data);
  }

  const cgpa = parseFloat(data.last_result ?? "0");
  const ielts = parseFloat(data.english_test_score ?? "0");
  const budget = data.budget ?? 0;

  const academicMatches = activeRules.filter((rule) => {
    if (!educationMatches(rule, data)) return false;
    if (rule.min_cgpa != null && cgpa < rule.min_cgpa) return false;
    if (rule.min_ielts != null && ielts < rule.min_ielts) return false;
    if (rule.min_budget != null && budget < rule.min_budget) return false;
    return true;
  });

  const preferredMatches = academicMatches.filter((rule) => countryMatches(rule, data));
  const matching = preferredMatches.length > 0 ? preferredMatches : academicMatches;

  const base = fallbackRecommendation(data);

  if (matching.length === 0) {
    return {
      ...base,
      university_category: "Review with a counselor",
      next_steps: [
        "Your profile may need a tailored plan — book a free consultation",
        ...base.next_steps.slice(1),
      ],
    };
  }

  const preferredName = data.preferred_country;
  const ruleCountries = [
    ...new Set(
      matching
        .map((r) => r.country)
        .filter((c): c is string => Boolean(c))
        .sort((a, b) => {
          if (!preferredName) return 0;
          if (normalize(a) === normalize(preferredName)) return -1;
          if (normalize(b) === normalize(preferredName)) return 1;
          return 0;
        })
    ),
  ];
  const ruleNotes = matching
    .map((r) => r.recommendation)
    .filter((n): n is string => Boolean(n));

  return {
    ...base,
    recommended_countries:
      ruleCountries.length > 0
        ? ruleCountries.slice(0, 4)
        : base.recommended_countries,
    university_category:
      ruleNotes[0] ?? `Eligible for ${matching.length} configured pathway(s)`,
    budget_feedback:
      matching.find((r) => r.min_budget != null)?.recommendation ??
      base.budget_feedback,
    matched_rules: matching.map((r) => r.country),
    next_steps: [
      ...(ruleNotes.length > 0
        ? [ruleNotes[0]!]
        : ["You meet our configured eligibility criteria"]),
      ...base.next_steps.slice(1),
    ],
  };
}

/** @deprecated Use EligibilityRecommendInput */
export type EligibilityInput = EligibilityRecommendInput;
