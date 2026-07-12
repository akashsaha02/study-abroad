"use client";

import { App, Button } from "antd";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";

interface PublishToggleProps {
  apiUrl: string;
  isPublished: boolean;
}

export function PublishToggle({ apiUrl, isPublished }: PublishToggleProps) {
  const { message } = App.useApp();
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
      message.success(next ? "Published" : "Unpublished");
      router.refresh();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button
      size="small"
      type={published ? "primary" : "default"}
      disabled={loading}
      onClick={toggle}
    >
      {published ? "Published" : "Draft"}
    </Button>
  );
}
