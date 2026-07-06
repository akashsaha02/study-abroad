import type { UserRole } from "@/types";

export function getDashboardPathForRole(role?: UserRole | null): string {
  if (role === "counselor") return "/counselor";
  if (role === "admin" || role === "super_admin") return "/admin";
  return "/dashboard";
}
