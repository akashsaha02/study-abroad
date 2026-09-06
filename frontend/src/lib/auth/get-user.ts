import { createClient } from "@/lib/supabase/server";
import type { AuthUser, Profile, UserRole } from "@/types";

export async function getUser(): Promise<AuthUser | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return {
    id: user.id,
    email: user.email ?? null,
    profile: (profile as Profile) ?? null,
  };
}

export async function requireUser(): Promise<AuthUser> {
  const user = await getUser();
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireRole(allowedRoles: UserRole[]): Promise<AuthUser> {
  const user = await requireUser();
  const role = user.profile?.role;

  if (!role || !allowedRoles.includes(role)) {
    throw new Error("Forbidden");
  }

  return user;
}

export function hasRole(
  role: UserRole | undefined | null,
  allowedRoles: UserRole[]
): boolean {
  return !!role && allowedRoles.includes(role);
}
