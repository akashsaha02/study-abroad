"use client";

import { AdminDeleteButton } from "@/components/admin/AdminDeleteButton";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import Link from "next/link";

interface CounselorRowActionsProps {
  id: string;
  name: string;
  isActive: boolean;
}

export function CounselorRowActions({ id, name, isActive }: CounselorRowActionsProps) {
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
      toast.success(next ? "Counselor activated" : "Counselor deactivated");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" asChild>
        <Link href={`/admin/counselors/${id}/edit`}>Edit</Link>
      </Button>
      <Button
        size="sm"
        variant={active ? "default" : "outline"}
        disabled={loading}
        onClick={toggleActive}
      >
        {active ? "Active" : "Inactive"}
      </Button>
      <AdminDeleteButton apiUrl={`/api/admin/counselors/${id}`} itemName={name} />
    </div>
  );
}
