import type { AuthUser } from "@abroadly/shared/types";
import {
  hasIeltsPermission,
  type IeltsPermission,
  type IeltsStaffRole,
} from "@abroadly/shared/ielts";
import { getUser } from "@/modules/identity/get-user";
import { ForbiddenError, UnauthorizedError } from "@/shared/http/errors";
import { createClient } from "@/infrastructure/supabase/client";

export async function loadIeltsStaffRole(
  userId: string
): Promise<IeltsStaffRole | null> {
  const supabase = createClient();
  const { data } = await supabase
    .from("ielts_staff")
    .select("staff_role")
    .eq("profile_id", userId)
    .maybeSingle();
  return (data?.staff_role as IeltsStaffRole | undefined) ?? null;
}

export async function assertIeltsPermission(
  permission: IeltsPermission
): Promise<{ user: AuthUser; staffRole: IeltsStaffRole | null }> {
  const user = await getUser();
  if (!user) throw new UnauthorizedError();
  if (user.profile?.is_active === false) throw new ForbiddenError();

  const staffRole = await loadIeltsStaffRole(user.id);
  if (!hasIeltsPermission(permission, user.profile?.role, staffRole)) {
    throw new ForbiddenError();
  }
  return { user, staffRole };
}

export async function requireStudent(): Promise<AuthUser> {
  const user = await getUser();
  if (!user) throw new UnauthorizedError();
  if (user.profile?.is_active === false) throw new ForbiddenError();
  return user;
}
