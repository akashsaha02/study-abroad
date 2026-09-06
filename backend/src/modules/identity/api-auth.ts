import { getUser } from "@/modules/identity/get-user";
import { hasRole } from "@abroadly/shared/auth";
import { ForbiddenError, UnauthorizedError } from "@/shared/http/errors";
import type { AuthUser, UserRole } from "@abroadly/shared/types";

export async function assertApiRole(allowedRoles: UserRole[]): Promise<AuthUser> {
  const user = await getUser();
  if (!user) {
    throw new UnauthorizedError();
  }
  if (user.profile?.is_active === false) {
    throw new ForbiddenError();
  }
  if (!hasRole(user.profile?.role, allowedRoles)) {
    throw new ForbiddenError();
  }
  return user;
}

export const ADMIN_ROLES = ["admin", "super_admin"] as const satisfies UserRole[];
export const STAFF_ROLES = ["counselor", "admin", "super_admin"] as const satisfies UserRole[];
export const SUPER_ADMIN_ROLES = ["super_admin"] as const satisfies UserRole[];
