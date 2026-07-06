import type { SupabaseClient } from "@supabase/supabase-js";
import { getCountryNameById } from "./resolve";

export async function enrichCostSettingPayload(
  supabase: SupabaseClient,
  data: { country_id: string; country?: string; [key: string]: unknown }
) {
  const countryName = await getCountryNameById(supabase, data.country_id);
  return {
    ...data,
    country: countryName ?? data.country ?? "",
  };
}

export async function enrichEligibilityRulePayload(
  supabase: SupabaseClient,
  data: { country_id: string; country?: string; [key: string]: unknown }
) {
  const countryName = await getCountryNameById(supabase, data.country_id);
  return {
    ...data,
    country: countryName ?? data.country ?? "",
  };
}

export async function enrichTestimonialPayload(
  supabase: SupabaseClient,
  data: {
    country_id?: string | null;
    university_id?: string | null;
    destination_country?: string | null;
    university_name?: string | null;
    [key: string]: unknown;
  }
) {
  const next = { ...data };

  if (data.country_id) {
    next.destination_country = await getCountryNameById(supabase, data.country_id);
  }

  if (data.university_id) {
    const { data: university } = await supabase
      .from("universities")
      .select("name, country_id")
      .eq("id", data.university_id)
      .maybeSingle();

    if (university?.name) next.university_name = university.name;
    if (university?.country_id && !data.country_id) {
      next.country_id = university.country_id;
      next.destination_country = await getCountryNameById(supabase, university.country_id);
    }
  }

  return next;
}
