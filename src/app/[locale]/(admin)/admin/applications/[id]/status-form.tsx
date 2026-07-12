"use client";

import { FormSelect } from "@/components/admin/forms/FormSelect";
import { APPLICATION_STATUSES } from "@/constants";
import { useStatusLabel } from "@/lib/i18n-format";
import type { ApplicationStatus } from "@/types";
import { useRouter } from "@/i18n/navigation";
import { App, Button, Card } from "antd";
import { useState } from "react";

interface ApplicationStatusFormProps {
  applicationId: string;
  currentStatus: ApplicationStatus;
}

export function ApplicationStatusForm({
  applicationId,
  currentStatus,
}: ApplicationStatusFormProps) {
  const { message } = App.useApp();
  const router = useRouter();
  const statusLabel = useStatusLabel();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  async function handleUpdate() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed");
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
      <div className="space-y-4 p-6">
        <h3 className="font-semibold">Update Status</h3>
        <FormSelect
          value={status}
          onChange={(value) => setStatus(value as ApplicationStatus)}
          className="w-full"
          options={APPLICATION_STATUSES.map((s) => ({
            value: s,
            label: statusLabel(s),
          }))}
        />
        <Button onClick={handleUpdate} disabled={loading} className="w-full" type="primary">
          {loading ? "Updating..." : "Update Status"}
        </Button>
      </div>
    </Card>
  );
}
