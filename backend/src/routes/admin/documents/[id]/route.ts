import { DOCUMENT_WITH_STUDENT_EMAIL } from "@/lib/supabase/embeds";
import { requireApiRole } from "@/lib/auth/api-auth";
import { createClient } from "@/lib/supabase/server";
import { sendDocumentStatusEmail } from "@/lib/emails/send";
import { NextResponse } from "@/lib/http/response";
import { z } from "zod";

const ADMIN_ROLES = ["admin", "super_admin"] as const;

const patchSchema = z.object({
  status: z.string(),
  review_note: z.string().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiRole([...ADMIN_ROLES]);
  if (auth.response) return auth.response;

  const { id } = await params;
  const parsed = patchSchema.safeParse(await request.json());
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message }, { status: 400 });
  }
  const body = parsed.data;
  const supabase = await createClient();

  const { data: doc } = await supabase
    .from("documents")
    .select(DOCUMENT_WITH_STUDENT_EMAIL)
    .eq("id", id)
    .single();

  if (!doc) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const { data, error } = await supabase
    .from("documents")
    .update({
      status: body.status,
      review_note: body.review_note,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id")
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  if (!data) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const email = (doc.students as { profiles?: { email?: string } })?.profiles?.email;
  if (email) {
    await sendDocumentStatusEmail(email, doc.document_type, body.status, body.review_note);
  }

  return NextResponse.json({ success: true });
}
