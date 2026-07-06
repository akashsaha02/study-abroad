"use client";

import { RoleBadge } from "@/components/common/RoleBadge";
import { selectClassName } from "@/components/admin/forms/select-class";
import { USER_ROLES } from "@/constants";
import type { UserRole } from "@/types";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface UserRowActionsProps {
  userId: string;
  currentRole: UserRole;
  isActive: boolean;
}

export function UserRowActions({ userId, currentRole, isActive }: UserRowActionsProps) {
  const router = useRouter();
  const [role, setRole] = useState(currentRole);
  const [active, setActive] = useState(isActive);
  const [loading, setLoading] = useState(false);

  async function patchUser(body: Record<string, unknown>) {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Failed to update user");
      toast.success("User updated");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  }

  function handleRoleChange(newRole: UserRole) {
    setRole(newRole);
    void patchUser({ role: newRole });
  }

  function handleActiveToggle(checked: boolean) {
    setActive(checked);
    void patchUser({ is_active: checked });
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <RoleBadge role={role} />
      <select
        value={role}
        onChange={(e) => handleRoleChange(e.target.value as UserRole)}
        disabled={loading}
        className={selectClassName}
        aria-label="Change role"
      >
        {USER_ROLES.map((r) => (
          <option key={r} value={r}>
            {r.replace(/_/g, " ")}
          </option>
        ))}
      </select>
      <label className="flex items-center gap-2 text-sm whitespace-nowrap">
        <input
          type="checkbox"
          checked={active}
          onChange={(e) => handleActiveToggle(e.target.checked)}
          disabled={loading}
        />
        Active
      </label>
    </div>
  );
}
