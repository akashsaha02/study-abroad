import { z } from "zod";
import { DOCUMENT_WITH_STUDENT_EMAIL } from "@abroadly/shared/embeds";
import { DOCUMENT_STATUSES } from "@abroadly/shared/constants";
import { createDocumentSignedUrl } from "@/modules/documents/signed-url";
import { createClient } from "@/infrastructure/supabase/client";
import { sendDocumentStatusEmail } from "@/modules/documents/documents.email";
import { AppError, ForbiddenError, NotFoundError, ValidationError } from "@/shared/http/errors";

const reviewSchema = z.object({
  status: z.enum(DOCUMENT_STATUSES),
  review_note: z.string().optional(),
});

const createSchema = z.object({
  student_id: z.string().uuid(),
  document_type: z.string().min(1),
  file_path: z.string().min(1),
  file_name: z.string().min(1),
  file_size: z.number().int().positive().optional(),
  mime_type: z.string().optional(),
});

export async function createStudentDocument(profileId: string, body: unknown) {
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error);
  }

  const supabase = createClient();
  const { data: student } = await supabase
    .from("students")
    .select("id")
    .eq("profile_id", profileId)
    .single();

  if (!student || student.id !== parsed.data.student_id) {
    throw new ForbiddenError();
  }

  const expectedPrefix = `${student.id}/`;
  if (
    parsed.data.file_path.includes("..") ||
    !parsed.data.file_path.startsWith(expectedPrefix)
  ) {
    throw new ValidationError("Invalid file path");
  }

  const { error } = await supabase.from("documents").insert({
    student_id: parsed.data.student_id,
    document_type: parsed.data.document_type,
    file_path: parsed.data.file_path,
    file_name: parsed.data.file_name,
    file_size: parsed.data.file_size,
    mime_type: parsed.data.mime_type,
    status: "pending_review",
  });

  if (error) throw new AppError("Failed to save document", 500);
}

export async function reviewDocument(id: string, body: unknown) {
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    throw new ValidationError(parsed.error);
  }

  const supabase = createClient();
  const { data: doc } = await supabase
    .from("documents")
    .select(DOCUMENT_WITH_STUDENT_EMAIL)
    .eq("id", id)
    .single();

  if (!doc) {
    throw new NotFoundError("Document not found");
  }

  const { data, error } = await supabase
    .from("documents")
    .update({
      status: parsed.data.status,
      review_note: parsed.data.review_note,
      reviewed_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id")
    .single();

  if (error) throw new AppError("Failed to review document", 500);
  if (!data) throw new NotFoundError("Document not found");

  const email = (doc.students as { profiles?: { email?: string } })?.profiles?.email;
  if (email) {
    await sendDocumentStatusEmail(
      email,
      doc.document_type,
      parsed.data.status,
      parsed.data.review_note
    );
  }
}

export async function previewDocument(id: string) {
  const supabase = createClient();
  const { data: doc, error } = await supabase
    .from("documents")
    .select("id, file_path, file_name, mime_type, document_type")
    .eq("id", id)
    .single();

  if (error || !doc) {
    throw new NotFoundError("Document not found");
  }

  const { url, error: signError } = await createDocumentSignedUrl(
    supabase,
    doc.file_path
  );

  if (signError || !url) {
    throw new AppError("Could not create preview URL", 500);
  }

  return {
    url,
    fileName: doc.file_name,
    mimeType: doc.mime_type,
    documentType: doc.document_type,
  };
}
