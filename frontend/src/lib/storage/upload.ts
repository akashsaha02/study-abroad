"use client";

import { createClient } from "@/lib/supabase/client";

export async function uploadPublicFile(bucket: string, file: File, path: string) {
  const supabase = createClient();

  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    upsert: true,
  });

  if (error) throw error;

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(data.path);

  return { path: data.path, publicUrl };
}
