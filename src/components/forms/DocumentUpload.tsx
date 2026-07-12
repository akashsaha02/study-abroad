"use client";

import { App, Card } from "antd";
import { AppSelect } from "@/components/common/AppSelect";
import { FormField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { DOCUMENT_TYPES, STORAGE_BUCKETS } from "@/constants";
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";

interface DocumentUploadProps {
  studentId: string;
}

export function DocumentUpload({ studentId }: DocumentUploadProps) {
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [documentType, setDocumentType] = useState<string>(DOCUMENT_TYPES[0] ?? "");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    const formData = new FormData(form);
    const file = formData.get("file") as File;

    if (!file?.size) {
      message.error("Please select a file");
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

      message.success("Document uploaded");
      form.reset();
      setDocumentType(DOCUMENT_TYPES[0] ?? "");
      window.location.reload();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <div className="p-6">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 sm:flex-row sm:items-end">
          <FormField label="Document Type" htmlFor="document_type" className="flex-1">
            <AppSelect
              id="document_type"
              value={documentType}
              onChange={setDocumentType}
              allowClear={false}
              size="middle"
              options={DOCUMENT_TYPES.map((t) => ({ value: t, label: t }))}
            />
          </FormField>
          <FormField label="File" htmlFor="file" className="flex-1">
            <input
              id="file"
              name="file"
              type="file"
              required
              className="flex h-10 w-full text-sm"
            />
          </FormField>
          <SubmitButton loading={loading}>Upload</SubmitButton>
        </form>
      </div>
    </Card>
  );
}
