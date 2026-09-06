import { requireApiRole } from "@/lib/auth/api-auth";
import { createClient } from "@/lib/supabase/server";
import { universitySchema } from "@/lib/validations/admin";
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

  const parsed = universitySchema.partial().safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);

  const { id } = await params;
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("universities")
    .update({ ...parsed.data, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "University not found" }, { status: 404 });
  }

  return NextResponse.json({ data });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiRole([...ADMIN_ROLES]);
  if (auth.response) return auth.response;

  const { id } = await params;
  const supabase = await createClient();
  const { error } = await supabase.from("universities").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
