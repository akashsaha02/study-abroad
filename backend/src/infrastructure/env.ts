const REQUIRED = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "FRONTEND_URL",
] as const;

function isLocalhostUrl(value: string) {
  try {
    const { hostname } = new URL(value);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

export function assertEnv() {
  const missing = REQUIRED.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error(`Missing required env: ${missing.join(", ")}`);
  }

  const frontendUrl = process.env.FRONTEND_URL!.replace(/\/+$/, "");
  process.env.FRONTEND_URL = frontendUrl;

  const hosted =
    process.env.NODE_ENV === "production" || Boolean(process.env.RENDER);

  if (hosted && isLocalhostUrl(frontendUrl)) {
    throw new Error(
      "FRONTEND_URL must be the production frontend origin (not localhost)"
    );
  }

  if (hosted && !process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY is not set; transactional email is disabled.");
  }
}
