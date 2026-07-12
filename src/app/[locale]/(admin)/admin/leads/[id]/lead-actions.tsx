"use client";

import { App, Card } from "antd";
import { FormSelect } from "@/components/admin/forms/FormSelect";
import { LEAD_STATUSES } from "@/constants";
import { useStatusLabel } from "@/lib/i18n-format";
import type { LeadStatus } from "@/types";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";

import { LeadAssignCounselor } from "./LeadAssignCounselor";
import { LeadConvertButton } from "./LeadConvertButton";

interface CounselorOption {
  profile_id: string;
  name: string;
}

interface ProfileOption {
  id: string;
  label: string;
}

interface LeadActionsProps {
  leadId: string;
  currentStatus: LeadStatus;
  assignedCounselorId: string | null;
  isConverted: boolean;
  counselors: CounselorOption[];
  studentProfiles: ProfileOption[];
}

export function LeadActions({
  leadId,
  currentStatus,
  assignedCounselorId,
  isConverted,
  counselors,
  studentProfiles,
}: LeadActionsProps) {
  const { message } = App.useApp();
  const router = useRouter();
  const statusLabel = useStatusLabel();
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
      message.success("Status updated");
      router.refresh();
    } catch {
      message.error("Failed to update status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <div className="space-y-6 p-6">
        <h3 className="font-semibold">Actions</h3>
        <div className="space-y-2">
          <label className="text-sm font-medium">Update Status</label>
          <FormSelect
            value={status}
            onChange={(value) => updateStatus(value as LeadStatus)}
            disabled={loading}
            className="w-full"
            options={LEAD_STATUSES.map((s) => ({
              value: s,
              label: statusLabel(s),
            }))}
          />
        </div>
        <LeadAssignCounselor
          leadId={leadId}
          counselors={counselors}
          currentCounselorId={assignedCounselorId}
        />
        <LeadConvertButton
          leadId={leadId}
          studentProfiles={studentProfiles}
          isConverted={isConverted}
        />
      </div>
    </Card>
  );
}
