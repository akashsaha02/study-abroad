"use client";

import { DocumentReviewActions } from "@/features/documents/components/DocumentReviewActions";
import { StatusBadge } from "@/components/common/StatusBadge";
import { formatDate } from "@/lib/i18n-format";
import { Empty } from "antd";

export interface AdminDocumentItem {
  id: string;
  document_type: string;
  file_name: string | null;
  mime_type?: string | null;
  status: string;
  statusLabel?: string;
  uploaded_at?: string | null;
}

interface AdminDocumentsPanelProps {
  documents: AdminDocumentItem[];
  locale?: string;
  emptyText?: string;
  canReview?: boolean;
}

export function AdminDocumentsPanel({
  documents,
  locale = "en-US",
  emptyText = "No documents uploaded yet",
  canReview = true,
}: AdminDocumentsPanelProps) {
  if (documents.length === 0) {
    return <Empty description={emptyText} image={Empty.PRESENTED_IMAGE_SIMPLE} />;
  }

  return (
    <ul className="divide-y divide-border/60">
      {documents.map((doc) => (
        <li
          key={doc.id}
          className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-medium">{doc.document_type}</p>
              <StatusBadge status={doc.status} label={doc.statusLabel} />
            </div>
            <p className="truncate text-sm text-muted-foreground">
              {doc.file_name ?? "Untitled file"}
              {doc.uploaded_at
                ? ` · ${formatDate(doc.uploaded_at, locale)}`
                : ""}
            </p>
          </div>
          <DocumentReviewActions
            documentId={doc.id}
            status={doc.status}
            fileName={doc.file_name}
            mimeType={doc.mime_type}
            canReview={canReview}
          />
        </li>
      ))}
    </ul>
  );
}
