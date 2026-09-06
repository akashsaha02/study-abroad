import { createClient } from "@/lib/supabase/server";
import { getDashboardPathForRole } from "@/lib/auth/redirects";
import { routing, type Locale } from "@/i18n/routing";
import type { UserRole } from "@/types";
import { NextResponse } from "next/server";

function localeFromRequest(request: Request): Locale {
  const cookie = request.headers.get("cookie") ?? "";
  const match = cookie.match(/(?:^|; )NEXT_LOCALE=([^;]+)/);
  const locale = decodeURIComponent(match?.[1] ?? "");
  if (routing.locales.includes(locale as Locale)) {
    return locale as Locale;
  }
  return routing.defaultLocale;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const locale = localeFromRequest(request);

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        const path = getDashboardPathForRole(profile?.role as UserRole);
        return NextResponse.redirect(`${origin}/${locale}${path}`);
      }
    }
  }

  return NextResponse.redirect(
    `${origin}/${locale}/login?error=auth_callback_failed`
  );
}
