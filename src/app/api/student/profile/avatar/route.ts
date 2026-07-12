import { getUser } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function PATCH(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const avatarUrl =
    body.avatar_url === null || body.avatar_url === ""
      ? null
      : String(body.avatar_url);

  if (avatarUrl && !avatarUrl.includes("/profile-avatars/")) {
    return NextResponse.json({ error: "Invalid avatar URL" }, { status: 400 });
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("profiles")
    .update({
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, avatar_url: avatarUrl });
}
