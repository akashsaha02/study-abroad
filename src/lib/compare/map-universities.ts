import { POPULAR_COUNTRIES } from "@/constants";
import type { CompareUniversity } from "@/data/compare";

function monogram(name: string): string {
  return name
    .split(/\s+/)
    .filter((w) => /[A-Za-z]/.test(w[0] ?? ""))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

function parseRanking(ranking: string | null): number {
  if (!ranking) return 999;
  const match = ranking.match(/\d+/);
  return match ? Number(match[0]) : 999;
}

type DbUniversity = {
  id: string;
  name: string;
  slug: string;
  city: string | null;
  ranking: string | null;
  tuition_min: number | null;
  tuition_max: number | null;
  application_fee: number | null;
  countries?: {
    name?: string;
    slug?: string;
    living_cost_min?: number | null;
    living_cost_max?: number | null;
  } | null;
};

export function mapDbUniversityToCompare(uni: DbUniversity): CompareUniversity {
  const countrySlug = uni.countries?.slug ?? "";
  const flag =
    POPULAR_COUNTRIES.find((c) => c.slug === countrySlug)?.flag ?? "🌍";
  const living =
    uni.countries?.living_cost_min ??
    uni.countries?.living_cost_max ??
    0;

  return {
    id: uni.id,
    name: uni.name,
    short: monogram(uni.name),
    country: uni.countries?.name ?? "",
    countryFlag: flag,
    city: uni.city ?? "",
    globalRanking: parseRanking(uni.ranking),
    tuitionUsd: uni.tuition_min ?? uni.tuition_max ?? 0,
    costOfLivingUsd: living,
    applicationFeeUsd: uni.application_fee ?? 0,
    slug: uni.slug,
  };
}
