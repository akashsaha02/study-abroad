#!/usr/bin/env node

import { copyFileSync, existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const source = join(root, ".env.local");
const targets = [join(root, "frontend", ".env.local"), join(root, "backend", ".env.local")];

if (!existsSync(source)) {
  console.error("Missing .env.local at repo root. Copy .env.example to .env.local first.");
  process.exit(1);
}

const required = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
  "NEXT_PUBLIC_APP_URL",
  "BACKEND_URL",
  "FRONTEND_URL",
];

function parseEnv(content) {
  const entries = new Map();
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    entries.set(trimmed.slice(0, eq), trimmed.slice(eq + 1));
  }
  return entries;
}

const base = parseEnv(readFileSync(source, "utf8"));

if (!base.has("BACKEND_URL")) base.set("BACKEND_URL", "http://localhost:3001");
if (!base.has("FRONTEND_URL")) base.set("FRONTEND_URL", "http://localhost:3000");
if (!base.has("NEXT_PUBLIC_APP_URL")) base.set("NEXT_PUBLIC_APP_URL", "http://localhost:3000");

const output = [...base.entries()]
  .map(([key, value]) => `${key}=${value}`)
  .join("\n")
  .concat("\n");

for (const target of targets) {
  writeFileSync(target, output);
  console.log(`Synced env → ${target.replace(root, ".")}`);
}

const missing = required.filter((key) => !base.has(key));
if (missing.length > 0) {
  console.warn(`Warning: missing keys in .env.local: ${missing.join(", ")}`);
}
