#!/usr/bin/env node
/**
 * Vercel build-time check. Next.js bakes /api rewrites from BACKEND_URL.
 * If this is localhost on Vercel, the browser never reaches Render.
 */
function hostname(value) {
  try {
    return new URL(value).hostname;
  } catch {
    return "";
  }
}

if (!process.env.VERCEL) process.exit(0);

const backendUrl = (process.env.BACKEND_URL ?? "").replace(/\/+$/, "");
const host = hostname(backendUrl);

if (!backendUrl || host === "localhost" || host === "127.0.0.1") {
  console.error(`
BACKEND_URL is missing or points at localhost on Vercel.

Vercel → Project → Settings → Environment Variables (Production):
  BACKEND_URL=https://your-service.onrender.com

Use the Render origin only (no /api suffix, no trailing slash).
Then Redeploy the frontend.
`);
  process.exit(1);
}

console.log(`Vercel /api rewrites → ${backendUrl}`);
