import { createServerClient } from "@supabase/ssr";
import { parseCookieHeader, serializeCookieHeader } from "@supabase/ssr";
import { getRequestContext } from "@/infrastructure/http/request-context";

export function createClient() {
  const { req, res } = getRequestContext();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return parseCookieHeader(req.headers.cookie ?? "").map(
            ({ name, value }) => ({ name, value: value ?? "" })
          );
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.appendHeader(
              "Set-Cookie",
              serializeCookieHeader(name, value, options)
            );
          });
        },
      },
    }
  );
}
