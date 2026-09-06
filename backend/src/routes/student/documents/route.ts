import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth/get-user";
import { jsonBody } from "@/lib/http/json-body";
import { NextResponse } from "@/lib/http/response";

export async function POST(request: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await jsonBody(request);
  const supabase = await createClient();

  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("profile_id", user.id)
    .single();

  if (!student || student.id !== body.student_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { error } = await supabase.from("documents").insert({
    student_id: body.student_id,
    document_type: body.document_type,
    file_path: body.file_path,
    file_name: body.file_name,
    file_size: body.file_size,
    mime_type: body.mime_type,
    status: "pending_review",
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
