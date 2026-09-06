import type { SupabaseClient } from "@supabase/supabase-js";

const FK_CHECKS: [string, string][] = [
  ["testimonials", "country_id"],
  ["testimonials", "university_id"],
  ["cost_settings", "country_id"],
  ["eligibility_rules", "country_id"],
  ["leads", "preferred_country_id"],
  ["students", "preferred_country_id"],
  ["leads", "university_id"],
  ["leads", "course_id"],
  ["leads", "service_slug"],
];

let cachedFks: Record<string, boolean> | null = null;

export async function detectFkColumns(
  supabase: SupabaseClient
): Promise<Record<string, boolean>> {
  if (cachedFks) return cachedFks;

  const result: Record<string, boolean> = {};
  for (const [table, column] of FK_CHECKS) {
    const key = `${table}.${column}`;
    const { error } = await supabase.from(table).select(column).limit(1);
    result[key] = !error;
  }
  cachedFks = result;
  return result;
}

export function hasFk(
  fks: Record<string, boolean>,
  table: string,
  column: string
): boolean {
  return fks[`${table}.${column}`] === true;
}

export function applyFkPayload<T extends Record<string, unknown>>(
  fks: Record<string, boolean>,
  payload: T,
  fields: [string, string][]
): T {
  const row = { ...payload };
  for (const [table, column] of fields) {
    if (!hasFk(fks, table, column) && column in row) {
      delete row[column];
    }
  }
  return row;
}

export async function tableExists(
  supabase: SupabaseClient,
  table: string
): Promise<boolean> {
  const { error } = await supabase.from(table).select("id").limit(1);
  return !error;
}
