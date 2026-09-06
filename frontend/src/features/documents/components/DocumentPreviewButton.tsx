"use client";

import { ArrowRight01Icon, File01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { App, Button, Modal, Spin } from "antd";
import { useState } from "react";

interface DocumentPreviewButtonProps {
  documentId: string;
  fileName?: string | null;
  mimeType?: string | null;
  size?: "small" | "middle";
}

export function DocumentPreviewButton({
  documentId,
  fileName,
  mimeType,
  size = "small",
}: DocumentPreviewButtonProps) {
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [url, setUrl] = useState<string | null>(null);
  const [resolvedMime, setResolvedMime] = useState(mimeType ?? null);
  const [resolvedName, setResolvedName] = useState(fileName ?? "Document");

  async function loadPreview() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/documents/${documentId}/preview`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to load preview");
      setUrl(data.url);
      setResolvedMime(data.mimeType ?? mimeType ?? null);
      setResolvedName(data.fileName ?? fileName ?? "Document");
      setOpen(true);
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Failed to load preview");
    } finally {
      setLoading(false);
    }
  }

  const canInlinePreview =
    !!resolvedMime &&
    (resolvedMime.startsWith("image/") ||
      resolvedMime === "application/pdf" ||
      resolvedMime.startsWith("text/"));

  return (
    <>
      <Button
        size={size}
        loading={loading}
        icon={<HugeiconsIcon icon={File01Icon} className="size-3.5" />}
        onClick={loadPreview}
      >
        Preview
      </Button>
      <Modal
        title={resolvedName}
        open={open}
        onCancel={() => setOpen(false)}
        footer={
          url ? (
            <Button
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              icon={<HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />}
            >
              Open / Download
            </Button>
          ) : null
        }
        width={canInlinePreview ? 900 : 480}
        destroyOnHidden
      >
        {!url ? (
          <div className="flex justify-center py-12">
            <Spin />
          </div>
        ) : canInlinePreview && resolvedMime?.startsWith("image/") ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt={resolvedName}
            className="mx-auto max-h-[70vh] w-auto max-w-full rounded-lg object-contain"
          />
        ) : canInlinePreview && resolvedMime === "application/pdf" ? (
          <iframe
            src={url}
            title={resolvedName}
            className="h-[70vh] w-full rounded-lg border"
          />
        ) : (
          <div className="space-y-3 py-4 text-center">
            <p className="text-sm text-muted-foreground">
              Inline preview is not available for this file type
              {resolvedMime ? ` (${resolvedMime})` : ""}.
            </p>
            <Button type="primary" href={url} target="_blank" rel="noopener noreferrer">
              Open file
            </Button>
          </div>
        )}
      </Modal>
    </>
  );
}
