"use client";

import { FormSelect } from "@/components/admin/forms/FormSelect";
import { RoleBadge } from "@/components/common/RoleBadge";
import { USER_ROLES } from "@/constants";
import { useRouter } from "@/i18n/navigation";
import type { UserRole } from "@/types";
import { App, Switch } from "antd";
import { useState } from "react";

interface UserRowActionsProps {
  userId: string;
  currentRole: UserRole;
  isActive: boolean;
}

export function UserRowActions({
  userId,
  currentRole,
  isActive,
}: UserRowActionsProps) {
  const router = useRouter();
  const { message } = App.useApp();
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
      message.success("User updated");
      router.refresh();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Update failed");
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
      <FormSelect
        value={role}
        onChange={(value) => handleRoleChange(value as UserRole)}
        disabled={loading}
        className="min-w-[140px]"
        aria-label="Change role"
        options={USER_ROLES.map((r) => ({
          value: r,
          label: r.replace(/_/g, " "),
        }))}
      />
      <label className="flex items-center gap-2 text-sm whitespace-nowrap">
        <Switch
          size="small"
          checked={active}
          onChange={handleActiveToggle}
          disabled={loading}
        />
        Active
      </label>
    </div>
  );
}
