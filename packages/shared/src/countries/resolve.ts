import type { SupabaseClient } from "@supabase/supabase-js";

export async function resolveCountryId(
  supabase: SupabaseClient,
  input: { countryId?: string | null; countryName?: string | null }
): Promise<string | null> {
  if (input.countryId) return input.countryId;
  const name = input.countryName?.trim();
  if (!name) return null;

  const { data: byName } = await supabase
    .from("countries")
    .select("id")
    .ilike("name", name)
    .maybeSingle();

  if (byName?.id) return byName.id;

  const { data: bySlug } = await supabase
    .from("countries")
    .select("id")
    .ilike("slug", name)
    .maybeSingle();

  return bySlug?.id ?? null;
}

export async function getCountryNameById(
  supabase: SupabaseClient,
  countryId: string | null | undefined
): Promise<string | null> {
  if (!countryId) return null;
  const { data } = await supabase.from("countries").select("name").eq("id", countryId).maybeSingle();
  return data?.name ?? null;
}
