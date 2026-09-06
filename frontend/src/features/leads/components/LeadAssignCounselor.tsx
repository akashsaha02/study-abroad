"use client";

import { AppSelect } from "@/components/common/AppSelect";
import { App, Button } from "antd";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";

interface CounselorOption {
  profile_id: string;
  name: string;
}

interface LeadAssignCounselorProps {
  leadId: string;
  counselors: CounselorOption[];
  currentCounselorId: string | null;
}

export function LeadAssignCounselor({
  leadId,
  counselors,
  currentCounselorId,
}: LeadAssignCounselorProps) {
  const { message } = App.useApp();
  const router = useRouter();
  const [counselorId, setCounselorId] = useState(currentCounselorId ?? "");
  const [loading, setLoading] = useState(false);

  async function handleAssign() {
    if (!counselorId) {
      message.error("Select a counselor");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assigned_counselor_id: counselorId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to assign");
      message.success("Counselor assigned");
      router.refresh();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Assign failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Assign Counselor</label>
      <AppSelect
        value={counselorId || undefined}
        onChange={setCounselorId}
        disabled={loading}
        className="w-full"
        placeholder="Select counselor"
        options={counselors.map((c) => ({
          value: c.profile_id,
          label: c.name,
        }))}
      />
      <Button
        size="small"
        className="w-full"
        disabled={loading || !counselorId}
        onClick={handleAssign}
        type="primary"
      >
        Assign
      </Button>
    </div>
  );
}
