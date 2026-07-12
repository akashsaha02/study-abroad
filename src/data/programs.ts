export type DegreeLevel = "Foundation" | "Bachelor" | "Master" | "PhD";
export type IntakeSeason = "Spring" | "Summer" | "Fall" | "Winter";

export interface Program {
  id: string;
  name: string;
  university: string;
  /** Short code used to render a logo placeholder monogram. */
  universityShort: string;
  logoUrl?: string;
  country: string;
  countryFlag: string;
  city: string;
  degreeLevel: DegreeLevel;
  subjectArea: string;
  /** Annual tuition in USD. */
  tuitionUsd: number;
  durationMonths: number;
  /** Minimum overall IELTS band required. */
  ieltsRequired: number;
  language: string;
  intakes: IntakeSeason[];
  ranking?: number;
}

/**
 * The student profile the Program Finder scores programs against.
 * In production this comes from the authenticated student record; here it is
 * seeded with sensible defaults and can be tuned from the UI.
 */
export interface StudentMatchProfile {
  preferredCountries: string[];
  degreeLevel: DegreeLevel | null;
  maxBudgetUsd: number;
  ieltsScore: number;
  subjectInterest: string;
}

export const DEFAULT_MATCH_PROFILE: StudentMatchProfile = {
  preferredCountries: ["United Kingdom", "Canada"],
  degreeLevel: "Master",
  maxBudgetUsd: 35000,
  ieltsScore: 7,
  subjectInterest: "Computer Science",
};

export const DEGREE_LEVELS: DegreeLevel[] = [
  "Foundation",
  "Bachelor",
  "Master",
  "PhD",
];

export const INTAKE_SEASONS: IntakeSeason[] = [
  "Spring",
  "Summer",
  "Fall",
  "Winter",
];

/**
 * Computes a 0-100 "Match Score" for a program against a student profile.
 * Weighted across country fit, degree fit, budget headroom, English
 * eligibility and subject interest so the ranking feels intuitive to students.
 */
export function computeMatchScore(
  program: Program,
  profile: StudentMatchProfile
): number {
  let score = 0;

  // Country preference — 25 pts
  if (profile.preferredCountries.length === 0) {
    score += 18;
  } else if (profile.preferredCountries.includes(program.country)) {
    score += 25;
  } else {
    score += 6;
  }

  // Degree level — 20 pts
  if (!profile.degreeLevel || profile.degreeLevel === program.degreeLevel) {
    score += 20;
  } else {
    score += 5;
  }

  // Budget — 25 pts, with graceful degradation when slightly over budget
  if (program.tuitionUsd <= profile.maxBudgetUsd) {
    const headroom = 1 - program.tuitionUsd / Math.max(profile.maxBudgetUsd, 1);
    score += 18 + Math.round(headroom * 7);
  } else {
    const overshoot = program.tuitionUsd / Math.max(profile.maxBudgetUsd, 1) - 1;
    score += Math.max(0, Math.round(15 - overshoot * 40));
  }

  // English eligibility — 20 pts
  if (profile.ieltsScore >= program.ieltsRequired) {
    score += 20;
  } else {
    const gap = program.ieltsRequired - profile.ieltsScore;
    score += Math.max(0, Math.round(20 - gap * 15));
  }

  // Subject interest — 10 pts (keyword overlap)
  const interest = profile.subjectInterest.trim().toLowerCase();
  if (interest) {
    const haystack = `${program.name} ${program.subjectArea}`.toLowerCase();
    const overlap = interest
      .split(/\s+/)
      .some((word) => word.length > 2 && haystack.includes(word));
    score += overlap ? 10 : 3;
  } else {
    score += 6;
  }

  return Math.max(0, Math.min(100, score));
}

export function matchTier(score: number): {
  label: string;
  className: string;
} {
  if (score >= 85)
    return {
      label: "Excellent match",
      className:
        "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
    };
  if (score >= 70)
    return {
      label: "Strong match",
      className:
        "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
    };
  if (score >= 50)
    return {
      label: "Fair match",
      className:
        "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
    };
  return {
    label: "Low match",
    className:
      "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  };
}

export const SAMPLE_PROGRAMS: Program[] = [
  {
    id: "p1",
    name: "MSc Computer Science",
    university: "University of Manchester",
    universityShort: "UM",
    country: "United Kingdom",
    countryFlag: "🇬🇧",
    city: "Manchester",
    degreeLevel: "Master",
    subjectArea: "Computer Science",
    tuitionUsd: 31500,
    durationMonths: 12,
    ieltsRequired: 6.5,
    language: "English",
    intakes: ["Fall"],
    ranking: 32,
  },
  {
    id: "p2",
    name: "MSc Data Science & AI",
    university: "University of Toronto",
    universityShort: "UT",
    country: "Canada",
    countryFlag: "🇨🇦",
    city: "Toronto",
    degreeLevel: "Master",
    subjectArea: "Computer Science",
    tuitionUsd: 28900,
    durationMonths: 16,
    ieltsRequired: 7,
    language: "English",
    intakes: ["Fall", "Winter"],
    ranking: 21,
  },
  {
    id: "p3",
    name: "BSc Software Engineering",
    university: "University of Melbourne",
    universityShort: "UOM",
    country: "Australia",
    countryFlag: "🇦🇺",
    city: "Melbourne",
    degreeLevel: "Bachelor",
    subjectArea: "Software Engineering",
    tuitionUsd: 33500,
    durationMonths: 36,
    ieltsRequired: 6.5,
    language: "English",
    intakes: ["Spring", "Fall"],
    ranking: 14,
  },
  {
    id: "p4",
    name: "MEng Artificial Intelligence",
    university: "Technical University of Munich",
    universityShort: "TUM",
    country: "Germany",
    countryFlag: "🇩🇪",
    city: "Munich",
    degreeLevel: "Master",
    subjectArea: "Artificial Intelligence",
    tuitionUsd: 4500,
    durationMonths: 24,
    ieltsRequired: 6.5,
    language: "English",
    intakes: ["Summer", "Winter"],
    ranking: 37,
  },
  {
    id: "p5",
    name: "MSc Business Analytics",
    university: "University of British Columbia",
    universityShort: "UBC",
    country: "Canada",
    countryFlag: "🇨🇦",
    city: "Vancouver",
    degreeLevel: "Master",
    subjectArea: "Business Analytics",
    tuitionUsd: 39500,
    durationMonths: 12,
    ieltsRequired: 6.5,
    language: "English",
    intakes: ["Fall"],
    ranking: 40,
  },
  {
    id: "p6",
    name: "PhD Machine Learning",
    university: "University of Edinburgh",
    universityShort: "UOE",
    country: "United Kingdom",
    countryFlag: "🇬🇧",
    city: "Edinburgh",
    degreeLevel: "PhD",
    subjectArea: "Machine Learning",
    tuitionUsd: 26000,
    durationMonths: 48,
    ieltsRequired: 7,
    language: "English",
    intakes: ["Fall", "Spring"],
    ranking: 22,
  },
  {
    id: "p7",
    name: "BEng Mechanical Engineering",
    university: "Technical University of Denmark",
    universityShort: "DTU",
    country: "Denmark",
    countryFlag: "🇩🇰",
    city: "Copenhagen",
    degreeLevel: "Bachelor",
    subjectArea: "Mechanical Engineering",
    tuitionUsd: 16800,
    durationMonths: 36,
    ieltsRequired: 6.5,
    language: "English",
    intakes: ["Fall"],
    ranking: 105,
  },
  {
    id: "p8",
    name: "MS Computer Science",
    university: "New York University",
    universityShort: "NYU",
    country: "United States",
    countryFlag: "🇺🇸",
    city: "New York",
    degreeLevel: "Master",
    subjectArea: "Computer Science",
    tuitionUsd: 51000,
    durationMonths: 18,
    ieltsRequired: 7.5,
    language: "English",
    intakes: ["Fall", "Spring"],
    ranking: 25,
  },
  {
    id: "p9",
    name: "Foundation in Engineering",
    university: "Monash University",
    universityShort: "MU",
    country: "Australia",
    countryFlag: "🇦🇺",
    city: "Melbourne",
    degreeLevel: "Foundation",
    subjectArea: "Engineering",
    tuitionUsd: 21000,
    durationMonths: 12,
    ieltsRequired: 5.5,
    language: "English",
    intakes: ["Summer", "Fall", "Winter"],
    ranking: 42,
  },
  {
    id: "p10",
    name: "MSc Cyber Security",
    university: "University of Malaya",
    universityShort: "UM",
    country: "Malaysia",
    countryFlag: "🇲🇾",
    city: "Kuala Lumpur",
    degreeLevel: "Master",
    subjectArea: "Cyber Security",
    tuitionUsd: 9800,
    durationMonths: 18,
    ieltsRequired: 6,
    language: "English",
    intakes: ["Spring", "Fall"],
    ranking: 65,
  },
  {
    id: "p11",
    name: "MSc Renewable Energy",
    university: "KTH Royal Institute",
    universityShort: "KTH",
    country: "Sweden",
    countryFlag: "🇸🇪",
    city: "Stockholm",
    degreeLevel: "Master",
    subjectArea: "Renewable Energy",
    tuitionUsd: 15500,
    durationMonths: 24,
    ieltsRequired: 6.5,
    language: "English",
    intakes: ["Fall"],
    ranking: 73,
  },
  {
    id: "p12",
    name: "MBA Global Management",
    university: "University of Warwick",
    universityShort: "UW",
    country: "United Kingdom",
    countryFlag: "🇬🇧",
    city: "Coventry",
    degreeLevel: "Master",
    subjectArea: "Business",
    tuitionUsd: 44000,
    durationMonths: 12,
    ieltsRequired: 7,
    language: "English",
    intakes: ["Fall"],
    ranking: 61,
  },
];
