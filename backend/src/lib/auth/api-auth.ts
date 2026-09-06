import { getUser, hasRole } from "@/lib/auth/get-user";
import { jsonResponse } from "@/lib/http/response";
import type { UserRole } from "@/types";

export async function requireApiRole(allowedRoles: UserRole[]) {
  const user = await getUser();
  if (!user) {
    return {
      user: null,
      response: jsonResponse({ error: "Unauthorized" }, { status: 401 }),
    };
  }
  if (!hasRole(user.profile?.role, allowedRoles)) {
    return {
      user: null,
      response: jsonResponse({ error: "Forbidden" }, { status: 403 }),
    };
  }
  return { user, response: null };
}
