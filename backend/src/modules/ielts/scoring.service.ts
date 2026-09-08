import type { BandRow } from "@abroadly/shared/ielts";
import {
  ACADEMIC_READING_BAND_TABLE,
  GENERAL_READING_BAND_TABLE,
  LISTENING_BAND_TABLE,
  calculateListeningBand,
  calculateOverallBand,
  calculateReadingBand,
} from "@abroadly/shared/ielts";
import { createClient } from "@/infrastructure/supabase/client";

type TableRow = { skill: string; ielts_type: string; min_raw: number; band: number };

function toRows(rows: TableRow[], skill: string, ieltsType: string): BandRow[] {
  return rows
    .filter((r) => r.skill === skill && r.ielts_type === ieltsType)
    .sort((a, b) => b.min_raw - a.min_raw)
    .map((r) => ({ min: r.min_raw, band: Number(r.band) }));
}

export async function loadBandTables() {
  const supabase = createClient();
  const { data } = await supabase
    .from("ielts_band_tables")
    .select("skill, ielts_type, min_raw, band");
  return (data ?? []) as TableRow[];
}

export async function listeningBandFromRaw(raw: number, ieltsType: "academic" | "general") {
  const rows = await loadBandTables();
  const table = toRows(rows, "listening", ieltsType);
  return calculateListeningBand(raw, table.length ? table : LISTENING_BAND_TABLE);
}

export async function readingBandFromRaw(raw: number, ieltsType: "academic" | "general") {
  const rows = await loadBandTables();
  const academic = toRows(rows, "reading", "academic");
  const general = toRows(rows, "reading", "general");
  return calculateReadingBand(
    raw,
    ieltsType,
    academic.length ? academic : ACADEMIC_READING_BAND_TABLE,
    general.length ? general : GENERAL_READING_BAND_TABLE
  );
}

export function overallFromSectionBands(bands: number[]) {
  return calculateOverallBand(bands);
}

export interface WritingEvaluationInput {
  prompt: string;
  response: string;
  wordCount: number;
}

export interface WritingEvaluationResult {
  band: number | null;
  feedback: string | null;
  status: "pending" | "manual" | "completed";
}

/** Extension point for a future real evaluator. No fake scores. */
export class WritingEvaluationService {
  async evaluate(_input: WritingEvaluationInput): Promise<WritingEvaluationResult> {
    void _input;
    return { band: null, feedback: null, status: "pending" };
  }
}

export const writingEvaluationService = new WritingEvaluationService();
