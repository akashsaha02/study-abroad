import { requireApiRole } from "@/lib/auth/api-auth";
import { createClient } from "@/lib/supabase/server";
import { sendDocumentStatusEmail } from "@/lib/emails/send";
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

  const { data: doc } = await supabase
    .from("documents")
    .select("*, students(profiles(email))")
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
