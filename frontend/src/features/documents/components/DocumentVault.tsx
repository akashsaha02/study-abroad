"use client";

import { App, Button, Card, Tag } from "antd";
import { AppSelect } from "@/components/common/AppSelect";
import { DOCUMENT_TYPES, STORAGE_BUCKETS } from "@/constants";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import type { Document, DocumentStatus } from "@/types";
import {
  Alert02Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  CloudUploadIcon,
  File01Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useRouter } from "@/i18n/navigation";
import { useCallback, useRef, useState } from "react";


type QueueStatus = "queued" | "uploading" | "success" | "error";

interface QueueItem {
  id: string;
  file: File;
  documentType: string;
  status: QueueStatus;
  error?: string;
}

interface DocumentVaultProps {
  studentId: string;
  documents: Document[];
}

const STATUS_META: Record<
  DocumentStatus,
  { label: string; className: string }
> = {
  approved: {
    label: "Approved",
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  pending_review: {
    label: "Under review",
    className:
      "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  needs_update: {
    label: "Needs update",
    className:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  },
  rejected: {
    label: "Rejected",
    className:
      "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  },
};

function formatSize(bytes: number | null) {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

let queueCounter = 0;

export function DocumentVault({ studentId, documents }: DocumentVaultProps) {
  const { message } = App.useApp();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [queue, setQueue] = useState<QueueItem[]>([]);

  const addFiles = useCallback((files: FileList | File[]) => {
    const next = Array.from(files).map((file) => ({
      id: `q${queueCounter++}`,
      file,
      documentType: DOCUMENT_TYPES[0],
      status: "queued" as QueueStatus,
    }));
    if (next.length) setQueue((q) => [...next, ...q]);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files?.length) addFiles(e.dataTransfer.files);
    },
    [addFiles]
  );

  function setItem(id: string, patch: Partial<QueueItem>) {
    setQueue((q) => q.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  }

  function removeItem(id: string) {
    setQueue((q) => q.filter((it) => it.id !== id));
  }

  async function uploadItem(item: QueueItem) {
    setItem(item.id, { status: "uploading", error: undefined });
    try {
      const supabase = createClient();
      const filePath = `${studentId}/${Date.now()}-${item.file.name}`;
      const { error: uploadError } = await supabase.storage
        .from(STORAGE_BUCKETS.studentDocuments)
        .upload(filePath, item.file);
      if (uploadError) throw uploadError;

      const res = await fetch("/api/student/documents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          student_id: studentId,
          document_type: item.documentType,
          file_path: filePath,
          file_name: item.file.name,
          file_size: item.file.size,
          mime_type: item.file.type,
        }),
      });
      if (!res.ok) throw new Error("Failed to save document record");

      setItem(item.id, { status: "success" });
      message.success(`${item.file.name} uploaded`);
      router.refresh();
    } catch (err) {
      const errMsg = err instanceof Error ? err.message : "Upload failed";
      setItem(item.id, { status: "error", error: errMsg });
      message.error(errMsg);
    }
  }

  async function uploadAll() {
    const pending = queue.filter((q) => q.status === "queued");
    for (const item of pending) {
      // Sequential uploads keep the UI states readable and avoid rate limits.
      await uploadItem(item);
    }
  }

  const pendingCount = queue.filter((q) => q.status === "queued").length;

  return (
    <div className="space-y-6">
      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-12 text-center transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50",
          isDragging
            ? "border-primary bg-primary/5"
            : "border-border bg-muted/30 hover:border-primary/40 hover:bg-muted/50"
        )}
        aria-label="Upload documents by clicking or dragging files here"
      >
        <div
          className={cn(
            "mb-4 flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary transition-transform",
            isDragging && "scale-110"
          )}
        >
          <HugeiconsIcon icon={CloudUploadIcon} className="size-7" />
        </div>
        <p className="text-sm font-semibold">
          {isDragging ? "Drop files to add them" : "Drag & drop your documents"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          or click to browse · PDF, JPG, PNG · Passports, transcripts, LORs
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addFiles(e.target.files);
            e.target.value = "";
          }}
        />
      </div>

      {/* Upload queue */}
      {queue.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold">
              Upload queue{" "}
              <span className="text-muted-foreground">({queue.length})</span>
            </p>
            {pendingCount > 0 && (
              <Button size="small" onClick={uploadAll}>
                Upload {pendingCount} file{pendingCount > 1 ? "s" : ""}
              </Button>
            )}
          </div>
          {queue.map((item) => (
            <QueueRow
              key={item.id}
              item={item}
              onTypeChange={(type) => setItem(item.id, { documentType: type })}
              onUpload={() => uploadItem(item)}
              onRemove={() => removeItem(item.id)}
            />
          ))}
        </div>
      )}

      {/* Existing documents */}
      <div>
        <h3 className="mb-3 text-sm font-semibold">
          Your vault{" "}
          <span className="text-muted-foreground">({documents.length})</span>
        </h3>
        {documents.length === 0 ? (
          <p className="rounded-xl border border-dashed bg-muted/30 px-6 py-10 text-center text-sm text-muted-foreground">
            No documents yet. Upload your first file above to build your vault.
          </p>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2">
            {documents.map((doc) => {
              const meta =
                STATUS_META[doc.status] ?? STATUS_META.pending_review;
              return (
                <Card key={doc.id} className="transition-shadow hover:shadow-md">
                  <div className="flex items-start gap-3 p-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                      <HugeiconsIcon icon={File01Icon} className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="truncate text-sm font-medium">
                          {doc.document_type}
                        </p>
                        <Tag className={cn("shrink-0", meta.className)}>
                          {meta.label}
                        </Tag>
                      </div>
                      <p className="truncate text-xs text-muted-foreground">
                        {doc.file_name}
                        {doc.file_size ? ` · ${formatSize(doc.file_size)}` : ""}
                      </p>
                      {doc.review_note && (
                        <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                          Note: {doc.review_note}
                        </p>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function QueueRow({
  item,
  onTypeChange,
  onUpload,
  onRemove,
}: {
  item: QueueItem;
  onTypeChange: (type: string) => void;
  onUpload: () => void;
  onRemove: () => void;
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center",
        item.status === "success" &&
          "border-emerald-300 bg-emerald-50/50 dark:border-emerald-900/50 dark:bg-emerald-900/10",
        item.status === "error" &&
          "border-rose-300 bg-rose-50/50 dark:border-rose-900/50 dark:bg-rose-900/10"
      )}
    >
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <StatusIcon status={item.status} />
        <div className="min-w-0">
          <p className="truncate text-sm font-medium">{item.file.name}</p>
          <p className="text-xs text-muted-foreground">
            {item.status === "error"
              ? item.error
              : item.status === "success"
                ? "Uploaded successfully"
                : item.status === "uploading"
                  ? "Uploading…"
                  : formatSize(item.file.size)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {item.status === "queued" && (
          <>
            <label className="sr-only" htmlFor={`type-${item.id}`}>
              Document type
            </label>
            <AppSelect
              id={`type-${item.id}`}
              value={item.documentType}
              onChange={onTypeChange}
              size="small"
              className="min-w-[140px]"
              allowClear={false}
              options={DOCUMENT_TYPES.map((t) => ({ value: t, label: t }))}
            />
            <Button size="small" onClick={onUpload}>
              Upload
            </Button>
          </>
        )}
        {item.status === "error" && (
          <Button size="small"  onClick={onUpload}>
            Retry
          </Button>
        )}
        {item.status !== "uploading" && (
          <Button
            size="small"
            type="text"
            onClick={onRemove}
            aria-label="Remove from queue"
          >
            <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
          </Button>
        )}
      </div>
    </div>
  );
}

function StatusIcon({ status }: { status: QueueStatus }) {
  if (status === "success")
    return (
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300">
        <HugeiconsIcon icon={CheckmarkCircle02Icon} className="size-4" />
      </span>
    );
  if (status === "error")
    return (
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-300">
        <HugeiconsIcon icon={Alert02Icon} className="size-4" />
      </span>
    );
  if (status === "uploading")
    return (
      <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
      </span>
    );
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
      <HugeiconsIcon icon={File01Icon} className="size-4" />
    </span>
  );
}
