import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing, type Locale } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";
import { getDashboardPathForRole } from "@/lib/auth/redirects";
import type { UserRole } from "@/types";

const intlMiddleware = createIntlMiddleware(routing);

const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"];

const DASHBOARD_ROLES: UserRole[] = ["student", "admin", "super_admin"];
const COUNSELOR_ROLES: UserRole[] = ["counselor", "admin", "super_admin"];
const ADMIN_ROLES: UserRole[] = ["admin", "super_admin"];

function getLocaleFromPath(pathname: string): Locale {
  const segment = pathname.split("/")[1];
  if (routing.locales.includes(segment as Locale)) {
    return segment as Locale;
  }
  return routing.defaultLocale;
}

function stripLocale(pathname: string): string {
  const locale = getLocaleFromPath(pathname);
  const without = pathname.replace(`/${locale}`, "") || "/";
  return without.startsWith("/") ? without : `/${without}`;
}

function withLocale(path: string, locale: Locale): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `/${locale}${normalized === "/" ? "" : normalized}`;
}

export async function proxy(request: NextRequest) {
  const intlResponse = intlMiddleware(request);
  const { supabase, user, response } = await updateSession(request, intlResponse);

  if (intlResponse.status >= 300 && intlResponse.status < 400) {
    return response;
  }

  const pathname = request.nextUrl.pathname;
  const locale = getLocaleFromPath(pathname);
  const pathWithoutLocale = stripLocale(pathname);

  const isAuthRoute = AUTH_ROUTES.some((route) =>
    pathWithoutLocale.startsWith(route)
  );

  const legacyProfilePaths = [
    "/dashboard/profile",
    "/dashboard/settings",
    "/admin/profile",
    "/counselor/profile",
  ];
  if (legacyProfilePaths.includes(pathWithoutLocale)) {
    const url = request.nextUrl.clone();
    url.pathname = withLocale("/account/profile", locale);
    return NextResponse.redirect(url);
  }

  const isProtected =
    pathWithoutLocale.startsWith("/dashboard") ||
    pathWithoutLocale.startsWith("/counselor") ||
    pathWithoutLocale.startsWith("/admin") ||
    pathWithoutLocale.startsWith("/account");

  if (!user && isProtected) {
    const url = request.nextUrl.clone();
    url.pathname = withLocale("/login", locale);
    url.searchParams.set("redirect", pathWithoutLocale);
    return NextResponse.redirect(url);
  }

  if (user && isAuthRoute) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const url = request.nextUrl.clone();
    url.pathname = withLocale(
      getDashboardPathForRole(profile?.role as UserRole),
      locale
    );
    return NextResponse.redirect(url);
  }

  if (user && isProtected) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    const role = profile?.role as UserRole | undefined;

    if (
      pathWithoutLocale.startsWith("/admin") &&
      (!role || !ADMIN_ROLES.includes(role))
    ) {
      const url = request.nextUrl.clone();
      url.pathname = withLocale(
        role === "counselor" ? "/counselor" : "/dashboard",
        locale
      );
      return NextResponse.redirect(url);
    }

    if (
      pathWithoutLocale.startsWith("/counselor") &&
      (!role || !COUNSELOR_ROLES.includes(role))
    ) {
      const url = request.nextUrl.clone();
      url.pathname = withLocale("/dashboard", locale);
      return NextResponse.redirect(url);
    }

    if (
      pathWithoutLocale.startsWith("/dashboard") &&
      role &&
      !DASHBOARD_ROLES.includes(role)
    ) {
      const url = request.nextUrl.clone();
      url.pathname = withLocale(
        role === "counselor" ? "/counselor" : "/admin",
        locale
      );
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp|json)$).*)",
  ],
};
