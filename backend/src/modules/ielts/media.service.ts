import { createClient } from "@/infrastructure/supabase/client";
import { IELTS_STORAGE_BUCKETS } from "@abroadly/shared/ielts";
import { AppError, ValidationError } from "@/shared/http/errors";

const AUDIO = ["audio/mpeg", "audio/wav", "audio/x-wav", "audio/mp4", "audio/webm"];
const IMAGE = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const MAX_AUDIO = 25 * 1024 * 1024;
const MAX_IMAGE = 8 * 1024 * 1024;

export async function registerMedia(input: {
  path: string;
  kind: "audio" | "image" | "diagram";
  mime_type?: string;
  duration_ms?: number;
  created_by: string;
  speaking?: boolean;
}) {
  if (input.path.includes("..")) throw new ValidationError("Invalid path");

  if (input.kind === "audio" && input.mime_type && !AUDIO.includes(input.mime_type)) {
    throw new ValidationError("Unsupported audio type");
  }
  if (input.kind !== "audio" && input.mime_type && !IMAGE.includes(input.mime_type)) {
    throw new ValidationError("Unsupported image type");
  }

  const supabase = createClient();
  const { data, error } = await supabase
    .from("ielts_media")
    .insert({
      bucket: input.speaking
        ? IELTS_STORAGE_BUCKETS.speaking
        : IELTS_STORAGE_BUCKETS.media,
      path: input.path,
      kind: input.kind,
      mime_type: input.mime_type ?? null,
      duration_ms: input.duration_ms ?? null,
      created_by: input.created_by,
    })
    .select("*")
    .single();

  if (error || !data) throw new AppError("Failed to save media", 500);
  return data;
}

export async function signedMediaUrl(mediaId: string) {
  const supabase = createClient();
  const { data } = await supabase.from("ielts_media").select("*").eq("id", mediaId).single();
  if (!data) return null;
  const { data: signed } = await supabase.storage
    .from(data.bucket)
    .createSignedUrl(data.path, 60 * 20);
  return { ...data, url: signed?.signedUrl ?? null };
}

export const MEDIA_LIMITS = { MAX_AUDIO, MAX_IMAGE, AUDIO, IMAGE };
