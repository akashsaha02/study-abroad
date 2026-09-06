import { POPULAR_COUNTRIES } from "@/constants";

const FLAG_BY_SLUG = Object.fromEntries(
  POPULAR_COUNTRIES.map((c) => [c.slug, c.flag])
) as Record<string, string>;

export function getCountryFlag(slug?: string | null): string {
  if (!slug) return "🌍";
  return FLAG_BY_SLUG[slug] ?? "🌍";
}

export function countryOptionLabel(name: string, slug?: string | null): string {
  return `${getCountryFlag(slug)} ${name}`;
}
