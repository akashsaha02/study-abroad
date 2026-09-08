#!/usr/bin/env node
/**
 * Vercel Ignored Build Step.
 * Exit 0 = skip deploy, exit 1 = build.
 * Skip when the commit does not touch the Next.js app or its workspace deps.
 */
import { execSync } from "node:child_process";

const watch = [
  "frontend",
  "packages/shared",
  "package.json",
  "package-lock.json",
  "vercel.json",
  "scripts/vercel-ignore.mjs",
];

try {
  execSync(`git diff --quiet HEAD^ HEAD -- ${watch.join(" ")}`, {
    stdio: "ignore",
  });
  console.log("No frontend-related changes; skipping Vercel build.");
  process.exit(0);
} catch {
  process.exit(1);
}
