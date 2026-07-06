"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function DocumentReviewActions({ documentId }: { documentId: string }) {
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
      toast.success(`Document ${status}`);
      router.refresh();
    } catch {
      toast.error("Failed to update document");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2">
      <Button size="sm" disabled={loading} onClick={() => review("approved")}>
        Approve
      </Button>
      <Button size="sm" variant="destructive" disabled={loading} onClick={() => review("rejected")}>
        Reject
      </Button>
    </div>
  );
}
