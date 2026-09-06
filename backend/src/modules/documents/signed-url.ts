import { STORAGE_BUCKETS } from "@abroadly/shared/constants";
import type { SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_EXPIRES_IN = 60 * 10;

export async function createDocumentSignedUrl(
  supabase: SupabaseClient,
  filePath: string,
  expiresIn = DEFAULT_EXPIRES_IN
): Promise<{ url: string | null; error: string | null }> {
  if (!filePath) {
    return { url: null, error: "Missing file path" };
  }

  const { data, error } = await supabase.storage
    .from(STORAGE_BUCKETS.studentDocuments)
    .createSignedUrl(filePath, expiresIn);

  if (error) {
    return { url: null, error: error.message };
  }

  return { url: data.signedUrl, error: null };
}
