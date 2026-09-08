import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";
import path from "node:path";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const monorepoRoot = path.join(__dirname, "..");

function supabaseHostname() {
  try {
    return new URL(
      process.env.NEXT_PUBLIC_SUPABASE_URL ?? "https://placeholder.supabase.co"
    ).hostname;
  } catch {
    return "placeholder.supabase.co";
  }
}

function isLocalhostHost(value: string) {
  try {
    const { hostname } = new URL(value);
    return hostname === "localhost" || hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

/** Baked into Vercel routing at build time. Must be the Render origin in production. */
function resolveBackendUrl() {
  const backendUrl = (process.env.BACKEND_URL ?? "http://localhost:3001").replace(
    /\/+$/,
    ""
  );
  if (process.env.VERCEL && (!process.env.BACKEND_URL || isLocalhostHost(backendUrl))) {
    throw new Error(
      "Set BACKEND_URL on Vercel to your Render API origin (e.g. https://abroadly-api.onrender.com). /api cannot rewrite to localhost in production."
    );
  }
  return backendUrl;
}

const nextConfig: NextConfig = {
  reactCompiler: true,
  transpilePackages: ["@abroadly/shared"],
  // Vercel looks for `.next` at the repo root (`/vercel/path0/.next`).
  // Local `next build` still writes to `frontend/.next`.
  distDir: process.env.VERCEL ? "../.next" : ".next",
  // npm workspaces hoist `next` to the repo root; a frontend-only root cannot resolve it.
  turbopack: {
    root: monorepoRoot,
  },
  outputFileTracingRoot: monorepoRoot,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: supabaseHostname(),
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
  async rewrites() {
    const backendUrl = resolveBackendUrl();
    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl}/api/:path*`,
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
