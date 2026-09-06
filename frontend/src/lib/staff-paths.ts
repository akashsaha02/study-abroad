import type { UserRole } from "@/types";

export function isAdminRole(role?: UserRole | null) {
  return role === "admin" || role === "super_admin";
}

export function staffRoot(role?: UserRole | null) {
  return role === "counselor" ? "/counselor" : "/admin";
}
