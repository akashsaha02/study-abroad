/**
 * Configurable IELTS band conversion.
 * Tables are estimates based on published Academic/GT conversion ranges.
 * Admins can override via ielts_band_tables.
 */

export type BandRow = { min: number; band: number };

export const LISTENING_BAND_TABLE: BandRow[] = [
  { min: 39, band: 9 },
  { min: 37, band: 8.5 },
  { min: 35, band: 8 },
  { min: 32, band: 7.5 },
  { min: 30, band: 7 },
  { min: 26, band: 6.5 },
  { min: 23, band: 6 },
  { min: 18, band: 5.5 },
  { min: 16, band: 5 },
  { min: 13, band: 4.5 },
  { min: 11, band: 4 },
  { min: 8, band: 3.5 },
  { min: 6, band: 3 },
  { min: 0, band: 2.5 },
];

export const ACADEMIC_READING_BAND_TABLE: BandRow[] = [
  { min: 39, band: 9 },
  { min: 37, band: 8.5 },
  { min: 35, band: 8 },
  { min: 33, band: 7.5 },
  { min: 30, band: 7 },
  { min: 27, band: 6.5 },
  { min: 23, band: 6 },
  { min: 19, band: 5.5 },
  { min: 15, band: 5 },
  { min: 13, band: 4.5 },
  { min: 10, band: 4 },
  { min: 8, band: 3.5 },
  { min: 6, band: 3 },
  { min: 0, band: 2.5 },
];

/** GT Reading typically needs more correct answers for the same band. */
export const GENERAL_READING_BAND_TABLE: BandRow[] = [
  { min: 40, band: 9 },
  { min: 39, band: 8.5 },
  { min: 37, band: 8 },
  { min: 36, band: 7.5 },
  { min: 34, band: 7 },
  { min: 32, band: 6.5 },
  { min: 30, band: 6 },
  { min: 27, band: 5.5 },
  { min: 23, band: 5 },
  { min: 19, band: 4.5 },
  { min: 15, band: 4 },
  { min: 12, band: 3.5 },
  { min: 9, band: 3 },
  { min: 0, band: 2.5 },
];

export function lookupBand(table: BandRow[], raw: number, max = 40): number {
  const clamped = Math.max(0, Math.min(max, Math.round(raw)));
  for (const row of table) {
    if (clamped >= row.min) return row.band;
  }
  return 0;
}

export function calculateRawScore(correct: number, max: number) {
  return {
    correct: Math.max(0, correct),
    max: Math.max(0, max),
    accuracy: max > 0 ? correct / max : 0,
  };
}

export function calculateListeningBand(
  raw: number,
  table: BandRow[] = LISTENING_BAND_TABLE
) {
  return lookupBand(table, raw);
}

export function calculateReadingBand(
  raw: number,
  moduleType: "academic" | "general" | "both" = "academic",
  academicTable: BandRow[] = ACADEMIC_READING_BAND_TABLE,
  generalTable: BandRow[] = GENERAL_READING_BAND_TABLE
) {
  const table =
    moduleType === "general" ? generalTable : academicTable;
  return lookupBand(table, raw);
}

/** Official IELTS rounding: .25→.5, .75→next whole. */
export function roundToBand(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 0;
  const floor = Math.floor(value);
  const frac = value - floor;
  if (frac < 0.25) return floor;
  if (frac < 0.75) return floor + 0.5;
  return floor + 1;
}

export function calculateOverallBand(bands: number[]): number {
  const usable = bands.filter((b) => b > 0);
  if (usable.length === 0) return 0;
  const avg = usable.reduce((a, b) => a + b, 0) / usable.length;
  return roundToBand(avg);
}

export function bandDescriptor(band: number): string {
  if (band >= 8.5) return "Expert user";
  if (band >= 7.5) return "Very good user";
  if (band >= 6.5) return "Competent–good user";
  if (band >= 5.5) return "Modest–competent user";
  if (band >= 4.5) return "Limited user";
  if (band > 0) return "Extremely limited user";
  return "—";
}

export const listeningBand = calculateListeningBand;
export const readingBand = calculateReadingBand;
export const overallBand = calculateOverallBand;

export function serializeBandTable(
  skill: "listening" | "reading",
  ieltsType: "academic" | "general",
  table: BandRow[]
) {
  return table.map((row) => ({
    skill,
    ielts_type: ieltsType,
    min_raw: row.min,
    band: row.band,
  }));
}
