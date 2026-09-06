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

const KNOWN_FKS: Record<string, boolean> = Object.fromEntries(
  FK_CHECKS.map(([table, column]) => [`${table}.${column}`, true])
);

/** Columns exist in tracked migrations — do not probe live schema. */
export async function detectFkColumns(
  _supabase?: SupabaseClient
): Promise<Record<string, boolean>> {
  return KNOWN_FKS;
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
  _supabase: SupabaseClient,
  _table: string
): Promise<boolean> {
  return true;
}
