"use client";

import { FormField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Card, CardContent } from "@/components/ui/card";
import { DOCUMENT_TYPES, STORAGE_BUCKETS } from "@/constants";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { toast } from "sonner";

interface DocumentUploadProps {
  studentId: string;
}

export function DocumentUpload({ studentId }: DocumentUploadProps) {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    const formData = new FormData(form);
    const file = formData.get("file") as File;
    const documentType = formData.get("document_type") as string;

    if (!file?.size) {
      toast.error("Please select a file");
      setLoading(false);
      return;
    }

    try {
      const supabase = createClient();
      const filePath = `${studentId}/${Date.now()}-${file.name}`;

      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKETS.studentDocuments)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const res = await fetch("/api/student/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          document_type: documentType,
          file_path: filePath,
          file_name: file.name,
          file_size: file.size,
          mime_type: file.type,
        }),
      });

      if (!res.ok) throw new Error("Failed to save document");

      toast.success("Document uploaded");
      form.reset();
      window.location.reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <FormField label="Document Type" htmlFor="document_type" className="flex-1">
            <select
              id="document_type"
              name="document_type"
              required
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
            >
              {DOCUMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="File" htmlFor="file" className="flex-1">
            <input
              id="file"
              name="file"
              type="file"
              required
              className="flex h-9 w-full text-sm"
            />
          </FormField>
          <SubmitButton loading={loading}>Upload</SubmitButton>
        </form>
      </CardContent>
    </Card>
  );
}
