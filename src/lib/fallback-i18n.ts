import type { Faq } from "@/types";

export function getLocalizedFallbackFaqs(t: (key: string) => string): Faq[] {
  return [1, 2, 3, 4].map((n) => ({
    id: String(n),
    question: t(`q${n}`),
    answer: t(`a${n}`),
    category: "general",
    country_id: null,
    sort_order: n,
    is_published: true,
    created_at: new Date().toISOString(),
  }));
}

export function getLocalizedCountryDescription(
  slug: string | undefined,
  t: (key: string) => string,
  fallback?: string | null
): string {
  if (!slug) return fallback ?? "";
  try {
    return t(slug);
  } catch {
    return fallback ?? "";
  }
}

export function getLocalizedService(
  slug: string,
  t: (key: string) => string
): { title: string; description: string } {
  return {
    title: t(`${slug}.title`),
    description: t(`${slug}.description`),
  };
}
