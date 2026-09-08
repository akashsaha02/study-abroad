/**
 * Single source of truth for env keys.
 * Local values live in gitignored `.env.local`.
 * Production values live in Vercel / Render dashboards — never in git.
 */

export const FRONTEND_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_APP_URL",
  "BACKEND_URL",
];

export const BACKEND_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "FRONTEND_URL",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "ADMIN_EMAIL",
];

export const LOCAL_REQUIRED = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_APP_URL",
  "BACKEND_URL",
  "FRONTEND_URL",
];

export const LOCAL_DEFAULTS = {
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
  FRONTEND_URL: "http://localhost:3000",
  BACKEND_URL: "http://localhost:3001",
};

export const LOCAL_URL_KEYS = [
  "NEXT_PUBLIC_APP_URL",
  "FRONTEND_URL",
  "BACKEND_URL",
];

export const PRODUCTION_FRONTEND_KEYS = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_APP_URL",
  "BACKEND_URL",
];

export const PRODUCTION_BACKEND_KEYS = [
  "FRONTEND_URL",
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
  "RESEND_API_KEY",
  "RESEND_FROM_EMAIL",
  "ADMIN_EMAIL",
];

export function parseEnv(content) {
  const entries = new Map();
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    entries.set(key, value);
  }
  return entries;
}

export function serializeEnv(entries, keys) {
  return keys
    .filter((key) => entries.has(key))
    .map((key) => `${key}=${entries.get(key)}`)
    .join("\n")
    .concat("\n");
}

export function stripTrailingSlash(value) {
  return value.replace(/\/+$/, "");
}

export function isLocalhostUrl(value) {
  try {
    const { hostname } = new URL(value);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
}
