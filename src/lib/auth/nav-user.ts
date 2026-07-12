import { getDashboardPathForRole, getProfilePathForRole } from "@/lib/auth/redirects";
import type { AuthUser, UserRole } from "@/types";

export interface NavbarUser {
  id: string;
  name: string;
  avatarUrl: string | null;
  role: UserRole;
  dashboardHref: string;
  profileHref: string;
}

export function toNavbarUser(user: AuthUser): NavbarUser {
  const role = user.profile?.role ?? "student";
  return {
    id: user.id,
    name: user.profile?.full_name ?? user.email ?? "User",
    avatarUrl: user.profile?.avatar_url ?? null,
    role,
    dashboardHref: getDashboardPathForRole(role),
    profileHref: getProfilePathForRole(role),
  };
}

export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
}
