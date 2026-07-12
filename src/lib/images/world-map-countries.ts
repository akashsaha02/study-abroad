import { POPULAR_COUNTRIES } from "@/constants";

/** ISO 3166-1 alpha-2 codes for map matching. */
export const SERVICE_COUNTRY_ALPHA2: Record<string, string> = {
  uk: "gb",
  canada: "ca",
  usa: "us",
  australia: "au",
  malaysia: "my",
  germany: "de",
};

/** ISO 3166-1 numeric codes in world-atlas countries-110m. */
export const SERVICE_COUNTRY_NUMERIC: Record<string, string> = {
  uk: "826",
  canada: "124",
  usa: "840",
  australia: "036",
  malaysia: "458",
  germany: "276",
};

/** Zoom level when focusing a destination (larger countries use lower zoom). */
export const SERVICE_COUNTRY_ZOOM: Record<string, number> = {
  uk: 5,
  canada: 2.4,
  usa: 2.4,
  australia: 3.2,
  malaysia: 4.5,
  germany: 5,
};

export const SERVICE_COUNTRIES = POPULAR_COUNTRIES.map((country) => ({
  slug: country.slug,
  name: country.name,
  flag: country.flag,
  alpha2: SERVICE_COUNTRY_ALPHA2[country.slug],
  numericId: SERVICE_COUNTRY_NUMERIC[country.slug],
}));

export const SERVICE_ALPHA2_SET = new Set(
  SERVICE_COUNTRIES.map((c) => c.alpha2.toLowerCase())
);

export const SERVICE_NUMERIC_SET = new Set(
  SERVICE_COUNTRIES.map((c) => c.numericId)
);

const NUMERIC_TO_SLUG = Object.fromEntries(
  SERVICE_COUNTRIES.map((c) => [c.numericId, c.slug])
) as Record<string, string>;

export function getServiceSlugByNumericId(
  id: string | number | undefined
): string | null {
  if (id == null) return null;
  return NUMERIC_TO_SLUG[String(id)] ?? null;
}

export function getServiceSlugByAlpha2(
  code: string | undefined
): string | null {
  if (!code) return null;
  const normalized = code.toLowerCase();
  const entry = SERVICE_COUNTRIES.find(
    (c) => c.alpha2.toLowerCase() === normalized
  );
  return entry?.slug ?? null;
}

export function isServiceCountry(code: string | undefined): boolean {
  if (!code) return false;
  return SERVICE_ALPHA2_SET.has(code.toLowerCase());
}

export function isServiceNumericId(id: string | number | undefined): boolean {
  if (id == null) return false;
  return SERVICE_NUMERIC_SET.has(String(id));
}

export function getServiceCountryBySlug(slug: string) {
  return SERVICE_COUNTRIES.find((c) => c.slug === slug);
}

/** Approximate [lng, lat] for sidebar quick-zoom. */
export const SERVICE_COUNTRY_CENTER: Record<string, [number, number]> = {
  uk: [-2, 54],
  canada: [-96, 56],
  usa: [-98, 39],
  australia: [134, -25],
  malaysia: [102, 4],
  germany: [10, 51],
};

export function getCountryMapPosition(slug: string): MapPosition {
  return {
    coordinates: SERVICE_COUNTRY_CENTER[slug] ?? DEFAULT_MAP_POSITION.coordinates,
    zoom: SERVICE_COUNTRY_ZOOM[slug] ?? 4,
  };
}

export interface MapPosition {
  coordinates: [number, number];
  zoom: number;
}

export const DEFAULT_MAP_POSITION: MapPosition = {
  coordinates: [10, 15],
  zoom: 1,
};
