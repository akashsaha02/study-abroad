"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LEAD_STATUSES } from "@/constants";
import type { LeadStatus } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface LeadActionsProps {
  leadId: string;
  currentStatus: LeadStatus;
}

export function LeadActions({ leadId, currentStatus }: LeadActionsProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: LeadStatus) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update");
      setStatus(newStatus);
      toast.success("Status updated");
      router.refresh();
    } catch {
      toast.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="space-y-4 p-6">
        <h3 className="font-semibold">Actions</h3>
        <div>
          <label className="text-sm font-medium">Update Status</label>
          <select
            value={status}
            onChange={(e) => updateStatus(e.target.value as LeadStatus)}
            disabled={loading}
            className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
          >
            {LEAD_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s.replace(/_/g, " ")}
              </option>
            ))}
          </select>
        </div>
        <Button
          variant="outline"
          className="w-full"
          disabled={loading}
          onClick={() => updateStatus("converted_to_student")}
        >
          Convert to Student
        </Button>
      </CardContent>
    </Card>
  );
}
