import type { CostSetting } from "@/types";

export interface CostBreakdown {
  tuition: number;
  living: number;
  visa: number;
  insurance: number;
  appFee: number;
}

export const DEFAULT_COSTS: Record<string, CostBreakdown> = {
  uk: { tuition: 18000, living: 1200, visa: 500, insurance: 600, appFee: 100 },
  canada: { tuition: 20000, living: 1000, visa: 200, insurance: 700, appFee: 150 },
  australia: { tuition: 22000, living: 1100, visa: 650, insurance: 500, appFee: 100 },
  usa: { tuition: 25000, living: 1300, visa: 200, insurance: 800, appFee: 100 },
  malaysia: { tuition: 8000, living: 500, visa: 100, insurance: 300, appFee: 50 },
  germany: { tuition: 3000, living: 900, visa: 100, insurance: 400, appFee: 75 },
};

type CountryRef = { id: string; slug: string; name: string };

/** Merge admin cost_settings into per-country defaults (by country slug). */
export function buildCostMap(
  settings: CostSetting[],
  countries: CountryRef[]
): Record<string, CostBreakdown> {
  const map: Record<string, CostBreakdown> = {
    ...DEFAULT_COSTS,
  };

  for (const setting of settings) {
    const country = countries.find((c) => c.id === setting.country_id);
    const slug = country?.slug;
    if (!slug) continue;

    const existing = map[slug] ?? DEFAULT_COSTS.uk;
    map[slug] = {
      tuition:
        setting.tuition_min ??
        setting.tuition_max ??
        existing.tuition,
      living:
        setting.living_cost_min ??
        setting.living_cost_max ??
        existing.living,
      visa: setting.visa_fee ?? existing.visa,
      insurance: setting.insurance_fee ?? existing.insurance,
      appFee: setting.application_fee ?? existing.appFee,
    };
  }

  return map;
}
