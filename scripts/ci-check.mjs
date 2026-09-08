#!/usr/bin/env node

import { spawnSync } from "node:child_process";
import { existsSync, rmSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();

const nextDir = join(root, "frontend", ".next");
if (existsSync(nextDir)) {
  console.log("Cleaning frontend/.next cache before build...");
  rmSync(nextDir, { recursive: true, force: true });
}

const ciEnv = {
  ...process.env,
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "ci-placeholder-key",
  NEXT_PUBLIC_APP_URL: "http://localhost:3000",
  SUPABASE_SERVICE_ROLE_KEY: "ci-placeholder-key",
  BACKEND_URL: "http://localhost:3001",
  FRONTEND_URL: "http://localhost:3000",
};

const steps = [
  { name: "Validate env examples", command: "node", args: ["scripts/validate-env.mjs"] },
  { name: "Lint frontend", command: "npm", args: ["run", "lint", "-w", "@abroadly/frontend"] },
  { name: "Lint backend", command: "npm", args: ["run", "lint", "-w", "@abroadly/backend"] },
  { name: "Typecheck shared", command: "npx", args: ["tsc", "--noEmit", "-p", "packages/shared"] },
  { name: "Build backend", command: "npm", args: ["run", "build", "-w", "@abroadly/backend"] },
  { name: "Build frontend", command: "npm", args: ["run", "build", "-w", "@abroadly/frontend"] },
];

function runStep({ name, command, args }) {
  console.log(`\n==> ${name}`);
  const result = spawnSync(command, args, {
    env: ciEnv,
    stdio: "inherit",
    shell: process.platform === "win32",
    cwd: root,
  });

  if (result.status !== 0) {
    console.error(`\n✗ ${name} failed (exit ${result.status ?? 1})`);
    process.exit(result.status ?? 1);
  }

  console.log(`✓ ${name} passed`);
}

console.log("Running CI checks...\n");
for (const step of steps) {
  runStep(step);
}
console.log("\n✓ All CI checks passed");
