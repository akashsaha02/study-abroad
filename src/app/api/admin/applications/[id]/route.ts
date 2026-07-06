import { validateApplicationTargets } from "@/lib/applications/validate-targets";
import { requireApiRole } from "@/lib/auth/api-auth";
import { createClient } from "@/lib/supabase/server";
import { sendApplicationStatusEmail } from "@/lib/emails/send";
import { z } from "zod";
import { NextResponse } from "next/server";

const ADMIN_ROLES = ["admin", "super_admin"] as const;

const patchSchema = z.object({
  status: z.string().optional(),
  country_id: z.string().uuid().nullable().optional(),
  university_id: z.string().uuid().nullable().optional(),
  course_id: z.string().uuid().nullable().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiRole([...ADMIN_ROLES]);
  if (auth.response) return auth.response;

  const { id } = await params;
  const body = await request.json();
  const parsed = patchSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }

  const supabase = await createClient();

  const { data: app } = await supabase
    .from("applications")
    .select("*, students(profiles(email))")
    .eq("id", id)
    .single();

  if (!app) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  const updatePayload: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };

  if (parsed.data.status !== undefined) {
    updatePayload.status = parsed.data.status;
  }

  const hasTargetUpdate =
    parsed.data.country_id !== undefined ||
    parsed.data.university_id !== undefined ||
    parsed.data.course_id !== undefined;

  if (hasTargetUpdate) {
    const validation = await validateApplicationTargets(supabase, {
      country_id: parsed.data.country_id ?? app.country_id,
      university_id: parsed.data.university_id ?? app.university_id,
      course_id: parsed.data.course_id ?? app.course_id,
    });

    if (!validation.ok) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    Object.assign(updatePayload, validation.data);
  }

  const { data, error } = await supabase
    .from("applications")
    .update(updatePayload)
    .eq("id", id)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Application not found" }, { status: 404 });
  }

  if (parsed.data.status) {
    const email = (app.students as { profiles?: { email?: string } })?.profiles?.email;
    if (email) {
      await sendApplicationStatusEmail(email, parsed.data.status);
    }
  }

  return NextResponse.json({ success: true });
}
