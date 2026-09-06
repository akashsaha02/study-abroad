import { Tag } from "antd";
import type { UserRole } from "@/types";

const roleColors: Record<UserRole, string> = {
  student: "blue",
  counselor: "purple",
  admin: "gold",
  super_admin: "red",
};

const roleLabels: Record<UserRole, string> = {
  student: "Student",
  counselor: "Counselor",
  admin: "Admin",
  super_admin: "Super Admin",
};

interface RoleBadgeProps {
  role: UserRole;
  className?: string;
}

export function RoleBadge({ role, className }: RoleBadgeProps) {
  return (
    <Tag color={roleColors[role]} className={className}>
      {roleLabels[role]}
    </Tag>
  );
}
