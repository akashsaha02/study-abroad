"use client";

import { selectClassName } from "@/components/admin/forms/select-class";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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
  const router = useRouter();
  const [profileId, setProfileId] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleConvert() {
    if (!profileId) {
      toast.error("Select a student profile");
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
      if (!res.ok) throw new Error(data.error ?? "Failed to convert");
      toast.success("Lead converted to student");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Convert failed");
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
      <select
        value={profileId}
        onChange={(e) => setProfileId(e.target.value)}
        disabled={loading}
        className={selectClassName}
      >
        <option value="">Select student profile</option>
        {studentProfiles.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </select>
      <Button
        className="w-full"
        disabled={loading || !profileId}
        onClick={handleConvert}
      >
        Convert to Student
      </Button>
    </div>
  );
}
