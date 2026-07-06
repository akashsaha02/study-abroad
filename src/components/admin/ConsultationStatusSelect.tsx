"use client";

import { CONSULTATION_STATUSES } from "@/constants";
import { selectClassName } from "@/components/admin/forms/select-class";
import type { ConsultationStatus } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface ConsultationStatusSelectProps {
  consultationId: string;
  currentStatus: ConsultationStatus;
}

export function ConsultationStatusSelect({
  consultationId,
  currentStatus,
}: ConsultationStatusSelectProps) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  async function updateStatus(newStatus: ConsultationStatus) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/consultations/${consultationId}`, {
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
    <select
      value={status}
      onChange={(e) => updateStatus(e.target.value as ConsultationStatus)}
      disabled={loading}
      className={selectClassName}
    >
      {CONSULTATION_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s.replace(/_/g, " ")}
        </option>
      ))}
    </select>
  );
}
