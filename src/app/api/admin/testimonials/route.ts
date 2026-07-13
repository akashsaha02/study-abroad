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

export async function POST(request: Request) {
  const auth = await requireApiRole([...ADMIN_ROLES]);
  if (auth.response) return auth.response;

  const parsed = testimonialSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);

  const supabase = await createClient();
  const fks = await detectFkColumns(supabase);
  let payload = await enrichTestimonialPayload(supabase, parsed.data);
  payload = applyFkPayload(fks, payload, [
    ["testimonials", "country_id"],
    ["testimonials", "university_id"],
  ]);

  const { data, error } = await supabase
    .from("testimonials")
    .insert(payload)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
