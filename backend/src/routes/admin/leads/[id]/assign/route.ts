import { requireApiRole } from "@/lib/auth/api-auth";
import { createClient } from "@/lib/supabase/server";
import { leadAssignSchema } from "@/lib/validations/admin";
import { NextResponse } from "@/lib/http/response";
import type { ZodError } from "zod";

const ADMIN_ROLES = ["admin", "super_admin"] as const;

function validationError(error: ZodError) {
  return NextResponse.json({ error: error.flatten() }, { status: 400 });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiRole([...ADMIN_ROLES]);
  if (auth.response) return auth.response;

  const parsed = leadAssignSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);

  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("leads")
    .update({
      assigned_counselor_id: parsed.data.assigned_counselor_id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  }

  return NextResponse.json({ data });
}
