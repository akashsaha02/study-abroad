export interface CompareUniversity {
  id: string;
  name: string;
  short: string;
  country: string;
  countryFlag: string;
  city: string;
  slug?: string;
  /** QS-style global ranking (lower is better). */
  globalRanking: number;
  /** Average annual tuition for international students, USD. */
  tuitionUsd: number;
  /** Estimated monthly cost of living, USD. */
  costOfLivingUsd: number;
  /** Application fee, USD. */
  applicationFeeUsd?: number;
  /** Post-study work visa duration in months (demo data only). */
  postStudyVisaMonths?: number;
  /** Graduate employment rate within 12 months, % (demo data only). */
  gradEmploymentRate?: number;
  /** Average acceptance rate, % (demo data only). */
  acceptanceRate?: number;
  /** Minimum IELTS (demo data only). */
  minIelts?: number;
}

export const COMPARE_UNIVERSITIES: CompareUniversity[] = [
  {
    id: "u1",
    name: "University of Manchester",
    short: "UM",
    country: "United Kingdom",
    countryFlag: "🇬🇧",
    city: "Manchester",
    globalRanking: 32,
    tuitionUsd: 31500,
    costOfLivingUsd: 1200,
    postStudyVisaMonths: 24,
    gradEmploymentRate: 93,
    acceptanceRate: 56,
    minIelts: 6.5,
  },
  {
    id: "u2",
    name: "University of Toronto",
    short: "UT",
    country: "Canada",
    countryFlag: "🇨🇦",
    city: "Toronto",
    globalRanking: 21,
    tuitionUsd: 28900,
    costOfLivingUsd: 1350,
    postStudyVisaMonths: 36,
    gradEmploymentRate: 95,
    acceptanceRate: 43,
    minIelts: 7,
  },
  {
    id: "u3",
    name: "University of Melbourne",
    short: "UOM",
    country: "Australia",
    countryFlag: "🇦🇺",
    city: "Melbourne",
    globalRanking: 14,
    tuitionUsd: 33500,
    costOfLivingUsd: 1450,
    postStudyVisaMonths: 48,
    gradEmploymentRate: 91,
    acceptanceRate: 70,
    minIelts: 6.5,
  },
  {
    id: "u4",
    name: "Technical University of Munich",
    short: "TUM",
    country: "Germany",
    countryFlag: "🇩🇪",
    city: "Munich",
    globalRanking: 37,
    tuitionUsd: 4500,
    costOfLivingUsd: 1100,
    postStudyVisaMonths: 18,
    gradEmploymentRate: 96,
    acceptanceRate: 8,
    minIelts: 6.5,
  },
  {
    id: "u5",
    name: "New York University",
    short: "NYU",
    country: "United States",
    countryFlag: "🇺🇸",
    city: "New York",
    globalRanking: 25,
    tuitionUsd: 51000,
    costOfLivingUsd: 2000,
    postStudyVisaMonths: 36,
    gradEmploymentRate: 90,
    acceptanceRate: 12,
    minIelts: 7.5,
  },
  {
    id: "u6",
    name: "University of British Columbia",
    short: "UBC",
    country: "Canada",
    countryFlag: "🇨🇦",
    city: "Vancouver",
    globalRanking: 40,
    tuitionUsd: 39500,
    costOfLivingUsd: 1400,
    postStudyVisaMonths: 36,
    gradEmploymentRate: 92,
    acceptanceRate: 52,
    minIelts: 6.5,
  },
  {
    id: "u7",
    name: "University of Malaya",
    short: "UM",
    country: "Malaysia",
    countryFlag: "🇲🇾",
    city: "Kuala Lumpur",
    globalRanking: 65,
    tuitionUsd: 9800,
    costOfLivingUsd: 550,
    postStudyVisaMonths: 12,
    gradEmploymentRate: 84,
    acceptanceRate: 60,
    minIelts: 6,
  },
  {
    id: "u8",
    name: "KTH Royal Institute",
    short: "KTH",
    country: "Sweden",
    countryFlag: "🇸🇪",
    city: "Stockholm",
    globalRanking: 73,
    tuitionUsd: 15500,
    costOfLivingUsd: 1150,
    postStudyVisaMonths: 12,
    gradEmploymentRate: 89,
    acceptanceRate: 35,
    minIelts: 6.5,
  },
];

export type CompareMetricKey =
  | "globalRanking"
  | "tuitionUsd"
  | "costOfLivingUsd"
  | "applicationFeeUsd"
  | "postStudyVisaMonths"
  | "gradEmploymentRate"
  | "acceptanceRate"
  | "minIelts";

export interface CompareMetric {
  key: CompareMetricKey;
  label: string;
  /** Whether a lower or higher value is "better" for highlighting. */
  better: "lower" | "higher";
  format: (value: number) => string;
  hint?: string;
}

const usd0 = (v: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(v);

export const COMPARE_METRICS: CompareMetric[] = [
  {
    key: "globalRanking",
    label: "Global ranking",
    better: "lower",
    format: (v) => `#${v}`,
    hint: "QS-style world ranking",
  },
  {
    key: "tuitionUsd",
    label: "Tuition / year",
    better: "lower",
    format: usd0,
  },
  {
    key: "costOfLivingUsd",
    label: "Cost of living / month",
    better: "lower",
    format: usd0,
  },
  {
    key: "applicationFeeUsd",
    label: "Application fee",
    better: "lower",
    format: usd0,
  },
  {
    key: "postStudyVisaMonths",
    label: "Post-study work visa",
    better: "higher",
    format: (v) =>
      v % 12 === 0 ? `${v / 12} year${v / 12 > 1 ? "s" : ""}` : `${v} months`,
  },
  {
    key: "gradEmploymentRate",
    label: "Graduate employment",
    better: "higher",
    format: (v) => `${v}%`,
    hint: "Employed within 12 months",
  },
  {
    key: "acceptanceRate",
    label: "Acceptance rate",
    better: "higher",
    format: (v) => `${v}%`,
  },
  {
    key: "minIelts",
    label: "Min. IELTS",
    better: "lower",
    format: (v) => v.toFixed(1),
  },
];

/** Metrics that have meaningful values for at least two universities. */
export function activeMetrics(
  universities: CompareUniversity[]
): CompareMetric[] {
  return COMPARE_METRICS.filter((metric) => {
    const values = universities
      .map((u) => u[metric.key])
      .filter((v): v is number => typeof v === "number" && v > 0);
    return values.length >= 2;
  });
}

/** Returns the id(s) of the best university for a metric among the selection. */
export function bestForMetric(
  metric: CompareMetric,
  universities: CompareUniversity[]
): string[] {
  if (universities.length < 2) return [];
  const values = universities
    .map((u) => u[metric.key])
    .filter((v): v is number => typeof v === "number" && v > 0);
  if (values.length < 2) return [];
  const target =
    metric.better === "lower" ? Math.min(...values) : Math.max(...values);
  return universities
    .filter((u) => {
      const v = u[metric.key];
      return typeof v === "number" && v > 0 && v === target;
    })
    .map((u) => u.id);
}
