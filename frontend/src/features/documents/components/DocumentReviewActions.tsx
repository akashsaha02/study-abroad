"use client";

import { App, Button, Space } from "antd";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { DocumentPreviewButton } from "./DocumentPreviewButton";

interface DocumentReviewActionsProps {
  documentId: string;
  status?: string;
  fileName?: string | null;
  mimeType?: string | null;
  showPreview?: boolean;
  canReview?: boolean;
}

export function DocumentReviewActions({
  documentId,
  status,
  fileName,
  mimeType,
  showPreview = true,
  canReview = true,
}: DocumentReviewActionsProps) {
  const { message } = App.useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function review(nextStatus: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/documents/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!res.ok) throw new Error("Failed");
      message.success(`Document marked as ${nextStatus.replace(/_/g, " ")}`);
      router.refresh();
    } catch {
      message.error("Failed to update document");
    } finally {
      setLoading(false);
    }
  }

  const isApproved = status === "approved";
  const isRejected = status === "rejected";

  return (
    <Space size={8} wrap>
      {showPreview && (
        <DocumentPreviewButton
          documentId={documentId}
          fileName={fileName}
          mimeType={mimeType}
        />
      )}
      {canReview && !isApproved && (
        <Button size="small" type="primary" disabled={loading} onClick={() => review("approved")}>
          Approve
        </Button>
      )}
      {canReview && !isRejected && (
        <Button size="small" danger disabled={loading} onClick={() => review("rejected")}>
          Reject
        </Button>
      )}
      {canReview && status !== "needs_update" && (
        <Button size="small" disabled={loading} onClick={() => review("needs_update")}>
          Needs update
        </Button>
      )}
    </Space>
  );
}
