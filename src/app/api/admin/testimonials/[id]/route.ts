import { requireApiRole } from "@/lib/auth/api-auth";
import { applyFkPayload, detectFkColumns } from "@/lib/countries/fk-guard";
import { enrichTestimonialPayload } from "@/lib/countries/enrich-payload";
import { createClient } from "@/lib/supabase/server";
import { testimonialSchema } from "@/lib/validations/admin";
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

  const parsed = testimonialSchema.partial().safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);

  const { id } = await params;
  const supabase = await createClient();
  const fks = await detectFkColumns(supabase);
  let payload = await enrichTestimonialPayload(supabase, parsed.data);
  payload = applyFkPayload(fks, payload, [
    ["testimonials", "country_id"],
    ["testimonials", "university_id"],
  ]);
  const { data, error } = await supabase
    .from("testimonials")
    .update(payload)
    .eq("id", id)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  if (!data) {
    return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
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
  const { error } = await supabase.from("testimonials").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
