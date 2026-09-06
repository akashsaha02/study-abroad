import { createClient } from "@/lib/supabase/server";
import { loadAuthUser, requireAuthUser, requireRole as requireSharedRole, hasRole } from "@abroadly/shared/auth";
import type { AuthUser, UserRole } from "@/types";

export async function getUser(): Promise<AuthUser | null> {
  const supabase = await createClient();
  return loadAuthUser(supabase);
}

export async function requireUser(): Promise<AuthUser> {
  const supabase = await createClient();
  return requireAuthUser(supabase);
}

export async function requireRole(allowedRoles: UserRole[]): Promise<AuthUser> {
  const supabase = await createClient();
  return requireSharedRole(supabase, allowedRoles);
}

export { hasRole };
