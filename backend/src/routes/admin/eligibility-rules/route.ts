import { requireApiRole } from "@/lib/auth/api-auth";
import { enrichEligibilityRulePayload } from "@/lib/countries/enrich-payload";
import { createClient } from "@/lib/supabase/server";
import { eligibilityRuleSchema } from "@/lib/validations/admin";
import { NextResponse } from "@/lib/http/response";
import type { ZodError } from "zod";

const ADMIN_ROLES = ["admin", "super_admin"] as const;

function validationError(error: ZodError) {
  return NextResponse.json({ error: error.flatten() }, { status: 400 });
}

export async function POST(request: Request) {
  const auth = await requireApiRole([...ADMIN_ROLES]);
  if (auth.response) return auth.response;

  const parsed = eligibilityRuleSchema.safeParse(await request.json());
  if (!parsed.success) return validationError(parsed.error);

  const supabase = await createClient();
  const now = new Date().toISOString();
  const payload = await enrichEligibilityRulePayload(supabase, parsed.data);
  const { data, error } = await supabase
    .from("eligibility_rules")
    .insert({ ...payload, updated_at: now })
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data });
}
