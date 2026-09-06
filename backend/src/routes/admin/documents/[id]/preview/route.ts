import { requireApiRole } from "@/lib/auth/api-auth";
import { createDocumentSignedUrl } from "@/lib/storage/signed-url";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "@/lib/http/response";

const STAFF_ROLES = ["admin", "super_admin", "counselor"] as const;

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiRole([...STAFF_ROLES]);
  if (auth.response) return auth.response;

  const { id } = await params;
  const supabase = await createClient();

  const { data: doc, error } = await supabase
    .from("documents")
    .select("id, file_path, file_name, mime_type, document_type")
    .eq("id", id)
    .single();

  if (error || !doc) {
    return NextResponse.json({ error: "Document not found" }, { status: 404 });
  }

  const { url, error: signError } = await createDocumentSignedUrl(
    supabase,
    doc.file_path
  );

  if (signError || !url) {
    return NextResponse.json(
      { error: signError ?? "Could not create preview URL" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    url,
    fileName: doc.file_name,
    mimeType: doc.mime_type,
    documentType: doc.document_type,
  });
}
