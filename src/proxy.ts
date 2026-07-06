import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";
import { getDashboardPathForRole } from "@/lib/auth/redirects";
import type { UserRole } from "@/types";

const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];

const DASHBOARD_ROLES: UserRole[] = ["student", "admin", "super_admin"];
const COUNSELOR_ROLES: UserRole[] = ["counselor", "admin", "super_admin"];
const ADMIN_ROLES: UserRole[] = ["admin", "super_admin"];

export async function proxy(request: NextRequest) {
  const { supabase, user, supabaseResponse } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/counselor") ||
    pathname.startsWith("/admin");

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const url = request.nextUrl.clone();
    url.pathname = getDashboardPathForRole(profile?.role as UserRole);
    return NextResponse.redirect(url);
  }

  if (user && isProtected) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role as UserRole | undefined;

    if (pathname.startsWith("/admin") && (!role || !ADMIN_ROLES.includes(role))) {
      const url = request.nextUrl.clone();
      url.pathname = role === "counselor" ? "/counselor" : "/dashboard";
      return NextResponse.redirect(url);
    }

    if (
      pathname.startsWith("/counselor") &&
      (!role || !COUNSELOR_ROLES.includes(role))
    ) {
      const url = request.nextUrl.clone();
      url.pathname = "/dashboard";
      return NextResponse.redirect(url);
    }

    if (
      pathname.startsWith("/dashboard") &&
      role &&
      !DASHBOARD_ROLES.includes(role)
    ) {
      const url = request.nextUrl.clone();
      url.pathname = role === "counselor" ? "/counselor" : "/admin";
      return NextResponse.redirect(url);
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
