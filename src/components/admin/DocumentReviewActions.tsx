"use client";

import { App, Button } from "antd";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";

export function DocumentReviewActions({ documentId }: { documentId: string }) {
  const { message } = App.useApp();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function review(status: string) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/documents/${documentId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
      message.success(`Document ${status}`);
      router.refresh();
    } catch {
      message.error("Failed to update document");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2">
      <Button size="small" disabled={loading} onClick={() => review("approved")}>
        Approve
      </Button>
      <Button size="small" danger disabled={loading} onClick={() => review("rejected")}>
        Reject
      </Button>
    </div>
  );
}
