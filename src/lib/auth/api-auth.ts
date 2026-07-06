import { getUser, hasRole } from "@/lib/auth/get-user";
import type { UserRole } from "@/types";
import { NextResponse } from "next/server";

export async function requireApiRole(allowedRoles: UserRole[]) {
  const user = await getUser();
  if (!user) {
    return { user: null, response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  if (!hasRole(user.profile?.role, allowedRoles)) {
    return { user: null, response: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
  }
  return { user, response: null };
}
