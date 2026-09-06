import { createClient } from "@/infrastructure/supabase/client";
import { AppError } from "@/shared/http/errors";

function isAllowedAvatarUrl(avatarUrl: string) {
  const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, "");
  if (!base) return false;
  const allowed = `${base}/storage/v1/object/public/profile-avatars/`;
  return avatarUrl.startsWith(allowed);
}

export async function updateAvatar(profileId: string, avatarUrlRaw: unknown) {
  const avatarUrl =
    avatarUrlRaw === null || avatarUrlRaw === ""
      ? null
      : String(avatarUrlRaw);

  if (avatarUrl && !isAllowedAvatarUrl(avatarUrl)) {
    throw new AppError("Invalid avatar URL", 400);
  }

  const supabase = createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", profileId);

  if (error) throw new AppError("Failed to update avatar", 500);
  return avatarUrl;
}
