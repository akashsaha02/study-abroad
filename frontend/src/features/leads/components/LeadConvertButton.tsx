"use client";

import { AppSelect } from "@/components/common/AppSelect";
import { parseApiError } from "@/components/admin/forms/api-error";
import { App, Button } from "antd";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";

interface ProfileOption {
  id: string;
  label: string;
}

interface LeadConvertButtonProps {
  leadId: string;
  studentProfiles: ProfileOption[];
  isConverted: boolean;
}

export function LeadConvertButton({
  leadId,
  studentProfiles,
  isConverted,
}: LeadConvertButtonProps) {
  const { message } = App.useApp();
  const router = useRouter();
  const [profileId, setProfileId] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  async function handleConvert() {
    if (!profileId) {
      message.error("Select a student profile");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/leads/${leadId}/convert`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile_id: profileId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(parseApiError(data, "Failed to convert"));
      message.success("Lead converted to student");
      router.refresh();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Convert failed");
    } finally {
      setLoading(false);
    }
  }

  if (isConverted) {
    return (
      <p className="text-sm text-muted-foreground">This lead has been converted to a student.</p>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Convert to Student</label>
      <AppSelect
        value={profileId}
        onChange={setProfileId}
        disabled={loading}
        className="w-full"
        placeholder="Select student profile"
        options={studentProfiles.map((p) => ({
          value: p.id,
          label: p.label,
        }))}
      />
      <Button
        className="w-full"
        type="primary"
        disabled={loading || !profileId}
        onClick={handleConvert}
      >
        Convert to Student
      </Button>
    </div>
  );
}
