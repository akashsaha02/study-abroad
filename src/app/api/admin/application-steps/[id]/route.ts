import { requireApiRole } from "@/lib/auth/api-auth";
import { createClient } from "@/lib/supabase/server";
import { applicationStepUpdateSchema } from "@/lib/validations/admin";
import { NextResponse } from "next/server";
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

  const parsed = applicationStepUpdateSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);

  const { id } = await params;
  const supabase = await createClient();

  const updateData = { ...parsed.data };
  if (parsed.data.status === "completed" && !parsed.data.completed_at) {
    updateData.completed_at = new Date().toISOString();
  }

  const { data, error } = await supabase
    .from("application_steps")
    .update(updateData)
    .eq("id", id)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Step not found" }, { status: 404 });
  }

  return NextResponse.json({ data });
}
