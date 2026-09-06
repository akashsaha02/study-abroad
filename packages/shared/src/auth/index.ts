import type { SupabaseClient } from "@supabase/supabase-js";
import type { AuthUser, Profile, UserRole } from "../types";

export async function loadAuthUser(
  supabase: SupabaseClient
): Promise<AuthUser | null> {
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

export function hasRole(
  role: UserRole | undefined | null,
  allowedRoles: UserRole[]
): boolean {
  return !!role && allowedRoles.includes(role);
}

export async function requireAuthUser(
  supabase: SupabaseClient
): Promise<AuthUser> {
  const user = await loadAuthUser(supabase);
  if (!user) {
    throw new Error("Unauthorized");
  }
  return user;
}

export async function requireRole(
  supabase: SupabaseClient,
  allowedRoles: UserRole[]
): Promise<AuthUser> {
  const user = await requireAuthUser(supabase);
  const role = user.profile?.role;

  if (!role || !allowedRoles.includes(role)) {
    throw new Error("Forbidden");
  }

  return user;
}
