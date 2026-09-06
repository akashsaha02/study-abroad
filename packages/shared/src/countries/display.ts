import type { SupabaseClient } from "@supabase/supabase-js";

export interface CountryResolvableRow {
  preferred_country?: string | null;
  preferred_country_id?: string | null;
}

/**
 * Batch-resolve country display names for list rows.
 * Falls back to preferred_country text when FK name is unavailable.
 */
export async function resolveCountryNamesForRows(
  supabase: SupabaseClient,
  rows: CountryResolvableRow[]
): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  const idsToFetch = new Set<string>();

  for (const row of rows) {
    if (row.preferred_country?.trim()) {
      const key = row.preferred_country_id ?? row.preferred_country;
      result.set(key, row.preferred_country.trim());
    } else if (row.preferred_country_id) {
      idsToFetch.add(row.preferred_country_id);
    }
  }

  if (idsToFetch.size > 0) {
    const { data: countries } = await supabase
      .from("countries")
      .select("id, name")
      .in("id", Array.from(idsToFetch));

    for (const country of countries ?? []) {
      result.set(country.id, country.name);
    }
  }

  return result;
}

export function getCountryDisplayName(
  row: CountryResolvableRow,
  countryMap: Map<string, string>
): string {
  if (row.preferred_country?.trim()) {
    return row.preferred_country.trim();
  }
  if (row.preferred_country_id) {
    return countryMap.get(row.preferred_country_id) ?? "—";
  }
  return "—";
}

export interface StudentCountryRow {
  id: string;
  preferred_country?: string | null;
  preferred_country_id?: string | null;
}

/**
 * Resolve country names for students, including junction table preferences.
 */
export async function resolveStudentCountryNames(
  supabase: SupabaseClient,
  students: StudentCountryRow[]
): Promise<Map<string, string>> {
  const result = new Map<string, string>();
  const studentIds = students.map((s) => s.id);

  const textMap = await resolveCountryNamesForRows(supabase, students);
  for (const student of students) {
    const name = getCountryDisplayName(student, textMap);
    if (name !== "—") {
      result.set(student.id, name);
    }
  }

  if (studentIds.length === 0) return result;

  const { data: prefs } = await supabase
    .from("student_preferred_countries")
    .select("student_id, country_id, countries(name)")
    .in("student_id", studentIds);

  const byStudent = new Map<string, string[]>();
  for (const pref of prefs ?? []) {
    const countryName =
      (pref.countries as { name?: string } | null)?.name ?? null;
    if (!countryName) continue;
    const list = byStudent.get(pref.student_id) ?? [];
    list.push(countryName);
    byStudent.set(pref.student_id, list);
  }

  for (const [studentId, names] of byStudent) {
    if (names.length > 0) {
      result.set(studentId, names.join(", "));
    }
  }

  for (const student of students) {
    if (!result.has(student.id)) {
      result.set(student.id, getCountryDisplayName(student, textMap));
    }
  }

  return result;
}
