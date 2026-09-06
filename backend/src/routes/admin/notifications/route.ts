import { requireApiRole } from "@/lib/auth/api-auth";
import { createClient } from "@/lib/supabase/server";
import { notificationSchema } from "@/lib/validations/admin";
import { NextResponse } from "@/lib/http/response";
import type { ZodError } from "zod";

const ADMIN_ROLES = ["admin", "super_admin"] as const;

function validationError(error: ZodError) {
  return NextResponse.json({ error: error.flatten() }, { status: 400 });
}

export async function POST(request: Request) {
  const auth = await requireApiRole([...ADMIN_ROLES]);
  if (auth.response) return auth.response;

  const parsed = notificationSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);

  const supabase = await createClient();
  // Insert without .select() — RETURNING would fail RLS when admin notifies another user
  // (SELECT policy only allows user_id = auth.uid() unless staff SELECT policy is applied).
  const { error } = await supabase.from("notifications").insert(parsed.data);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: { ok: true } });
}
