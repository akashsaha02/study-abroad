#!/usr/bin/env node

import { spawnSync } from "node:child_process";

const ciEnv = {
  ...process.env,
  NEXT_PUBLIC_SUPABASE_URL: "https://example.supabase.co",
  NEXT_PUBLIC_SUPABASE_ANON_KEY: "ci-placeholder-key",
  SUPABASE_SERVICE_ROLE_KEY: "ci-placeholder-key",
};

const steps = [
  { name: "Lint", command: "npm", args: ["run", "lint"] },
  { name: "Build", command: "npm", args: ["run", "build"] },
];

function runStep({ name, command, args }) {
  console.log(`\n==> ${name}`);
  const result = spawnSync(command, args, {
    env: ciEnv,
    stdio: "inherit",
    shell: process.platform === "win32",
  });

  if (result.status !== 0) {
    console.error(`\n✗ ${name} failed (exit ${result.status ?? 1})`);
    process.exit(result.status ?? 1);
  }

  console.log(`✓ ${name} passed`);
}

console.log("Running local CI checks (same as GitHub Actions)...");
console.log("Steps: lint → build");

for (const step of steps) {
  runStep(step);
}

console.log("\n✓ All CI checks passed. Safe to push.");
