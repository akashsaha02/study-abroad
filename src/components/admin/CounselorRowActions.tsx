"use client";

import { App, Button } from "antd";
import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";
import { Link } from "@/i18n/navigation";

interface CounselorRowActionsProps {
  id: string;
  name: string;
  isActive: boolean;
}

export function CounselorRowActions({ id, name, isActive }: CounselorRowActionsProps) {
  const { message } = App.useApp();
  const router = useRouter();
  const [active, setActive] = useState(isActive);
  const [loading, setLoading] = useState(false);

  async function toggleActive() {
    const next = !active;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/counselors/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ is_active: next }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to update");
      setActive(next);
      message.success(next ? "Counselor activated" : "Counselor deactivated");
      router.refresh();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Link href={`/admin/counselors/${id}/edit`}>
          <Button  size="small">Edit</Button>
        </Link>
      <Button
        size="small"
        type={active ? "primary" : "default"}
        disabled={loading}
        onClick={toggleActive}
      >
        {active ? "Active" : "Inactive"}
      </Button>
      <AdminDeleteButton apiUrl={`/api/admin/counselors/${id}`} itemName={name} />
    </div>
  );
}
