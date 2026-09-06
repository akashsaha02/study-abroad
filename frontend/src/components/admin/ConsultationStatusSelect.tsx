"use client";

import { AppSelect } from "@/components/common/AppSelect";
import { CONSULTATION_STATUSES } from "@/constants";
import { useStatusLabel } from "@/lib/i18n-format";
import { useRouter } from "@/i18n/navigation";
import type { ConsultationStatus } from "@/types";
import { App } from "antd";
import { useState } from "react";

interface ConsultationStatusSelectProps {
  consultationId: string;
  currentStatus: ConsultationStatus;
}

export function ConsultationStatusSelect({
  consultationId,
  currentStatus,
}: ConsultationStatusSelectProps) {
  const router = useRouter();
  const { message } = App.useApp();
  const statusLabel = useStatusLabel();
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
      message.success("Status updated");
      router.refresh();
    } catch {
      message.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AppSelect
      value={status}
      onChange={(value) => updateStatus(value as ConsultationStatus)}
      disabled={loading}
      className="min-w-[160px]"
      size="middle"
      options={CONSULTATION_STATUSES.map((s) => ({
        value: s,
        label: statusLabel(s),
      }))}
    />
  );
}
