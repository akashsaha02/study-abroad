import { POPULAR_COUNTRIES } from "@/constants";

export const COUNTRY_IMAGE_BY_SLUG: Record<string, string> = Object.fromEntries(
  POPULAR_COUNTRIES.map((c) => [c.slug, `/images/countries/${c.slug}.jpg`])
);

export const UNIVERSITY_FALLBACK_IMAGE_BY_SLUG: Record<string, string> = {
  "university-of-toronto": "/images/universities/university-of-toronto.jpg",
  "university-of-manchester": "/images/universities/university-of-manchester.jpg",
  "monash-university": "/images/universities/monash-university.jpg",
};

export function getCountryImage(slug?: string | null): string | null {
  if (!slug) return null;
  return COUNTRY_IMAGE_BY_SLUG[slug] ?? null;
}

export function getUniversityImage(uni: {
  slug?: string | null;
  logo_url?: string | null;
}): string | null {
  if (uni.logo_url) return uni.logo_url;
  if (uni.slug && UNIVERSITY_FALLBACK_IMAGE_BY_SLUG[uni.slug]) {
    return UNIVERSITY_FALLBACK_IMAGE_BY_SLUG[uni.slug];
  }
  return null;
}
