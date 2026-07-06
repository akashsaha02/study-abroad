"use client";

import { selectClassName } from "@/components/admin/forms/select-class";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

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
  const router = useRouter();
  const [counselorId, setCounselorId] = useState(currentCounselorId ?? "");
  const [loading, setLoading] = useState(false);

  async function handleAssign() {
    if (!counselorId) {
      toast.error("Select a counselor");
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
      toast.success("Counselor assigned");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Assign failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Assign Counselor</label>
      <select
        value={counselorId}
        onChange={(e) => setCounselorId(e.target.value)}
        disabled={loading}
        className={selectClassName}
      >
        <option value="">Select counselor</option>
        {counselors.map((c) => (
          <option key={c.profile_id} value={c.profile_id}>
            {c.name}
          </option>
        ))}
      </select>
      <Button
        variant="outline"
        size="sm"
        className="w-full"
        disabled={loading || !counselorId}
        onClick={handleAssign}
      >
        Assign
      </Button>
    </div>
  );
}
