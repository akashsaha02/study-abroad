"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface PublishToggleProps {
  apiUrl: string;
  isPublished: boolean;
}

export function PublishToggle({ apiUrl, isPublished }: PublishToggleProps) {
  const router = useRouter();
  const [published, setPublished] = useState(isPublished);
  const [loading, setLoading] = useState(false);

  async function toggle() {
    const next = !published;
    setLoading(true);
    try {
      const res = await fetch(apiUrl, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          is_published: next,
          ...(next ? { published_at: new Date().toISOString() } : {}),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to update");
      setPublished(next);
      toast.success(next ? "Published" : "Unpublished");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      size="sm"
      variant={published ? "default" : "outline"}
      disabled={loading}
      onClick={toggle}
    >
      {published ? "Published" : "Draft"}
    </Button>
  );
}
