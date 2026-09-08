#!/usr/bin/env node

import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import {
  BACKEND_KEYS,
  FRONTEND_KEYS,
  LOCAL_DEFAULTS,
  LOCAL_REQUIRED,
  LOCAL_URL_KEYS,
  isLocalhostUrl,
  parseEnv,
  serializeEnv,
  stripTrailingSlash,
} from "./env.mjs";

const root = process.cwd();
const source = join(root, ".env.local");

if (!existsSync(source)) {
  console.error("Missing .env.local at repo root. Copy .env.example to .env.local first.");
  process.exit(1);
}

const base = parseEnv(readFileSync(source, "utf8"));

for (const [key, value] of Object.entries(LOCAL_DEFAULTS)) {
  if (!base.has(key)) base.set(key, value);
}

for (const key of LOCAL_URL_KEYS) {
  const value = base.get(key);
  if (value) base.set(key, stripTrailingSlash(value));
}

const productionLooking = LOCAL_URL_KEYS.filter((key) => {
  const value = base.get(key);
  return value && !isLocalhostUrl(value);
});

if (productionLooking.length > 0) {
  console.warn(
    `Warning: ${productionLooking.join(", ")} in .env.local is not localhost. Local /api rewrites and CORS will hit production. Keep local URLs in .env.local; set production values on Vercel and Render.`
  );
}

const frontendTarget = join(root, "frontend", ".env.local");
const backendTarget = join(root, "backend", ".env.local");

writeFileSync(frontendTarget, serializeEnv(base, FRONTEND_KEYS));
writeFileSync(backendTarget, serializeEnv(base, BACKEND_KEYS));

console.log("Synced env → ./frontend/.env.local (frontend keys only)");
console.log("Synced env → ./backend/.env.local (backend keys only)");

const missing = LOCAL_REQUIRED.filter((key) => !base.get(key));
if (missing.length > 0) {
  console.warn(`Warning: missing keys in .env.local: ${missing.join(", ")}`);
  process.exitCode = 1;
}
