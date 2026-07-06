import { requireApiRole } from "@/lib/auth/api-auth";
import { createClient } from "@/lib/supabase/server";
import { sendApplicationStatusEmail } from "@/lib/emails/send";
import { NextResponse } from "next/server";

const ADMIN_ROLES = ["admin", "super_admin"] as const;

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiRole([...ADMIN_ROLES]);
  if (auth.response) return auth.response;

  const { id } = await params;
  const body = await request.json();
  const supabase = await createClient();

  const { data: app } = await supabase
    .from("applications")
    .select("*, students(profiles(email))")
    .eq("id", id)
    .single();

  if (!app) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("applications")
    .update({ status: body.status, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const email = (app.students as { profiles?: { email?: string } })?.profiles?.email;
  if (email) {
    await sendApplicationStatusEmail(email, body.status);
  }

  return NextResponse.json({ success: true });
}
