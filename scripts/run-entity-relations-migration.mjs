/**
 * Applies entity-relations FK migration via direct Postgres connection.
 * Requires password in .env.local (password=...) and NEXT_PUBLIC_SUPABASE_URL
 *
 * Usage: node --env-file=.env.local scripts/run-entity-relations-migration.mjs
 */

import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));

function requireEnv(name) {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing ${name}`);
    process.exit(1);
  }
  return value;
}

function projectRefFromUrl(url) {
  const match = url.match(/https:\/\/([^.]+)\.supabase\.co/);
  if (!match) throw new Error("Invalid NEXT_PUBLIC_SUPABASE_URL");
  return match[1];
}

async function main() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const dbPassword = requireEnv("password");
  const ref = projectRefFromUrl(url);
  const encoded = encodeURIComponent(dbPassword);

  const candidates = [
    `postgresql://postgres:${encoded}@db.${ref}.supabase.co:5432/postgres`,
    `postgresql://postgres.${ref}:${encoded}@aws-0-ap-south-1.pooler.supabase.com:5432/postgres`,
    `postgresql://postgres.${ref}:${encoded}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`,
  ];

  const sql = readFileSync(
    join(__dirname, "../supabase/migrations/20250707000000_entity_relations_fks.sql"),
    "utf8"
  );

  let lastError;
  for (const connectionString of candidates) {
    const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });
    try {
      await client.connect();
      console.log("Connected. Applying entity-relations migration...");
      await client.query(sql);
      await client.end();
      console.log("Migration applied successfully.");
      return;
    } catch (err) {
      lastError = err;
      try {
        await client.end();
      } catch {
        /* ignore */
      }
    }
  }

  console.error("Could not connect to Postgres:", lastError?.message ?? "unknown error");
  console.error("\nApply this SQL manually in Supabase Dashboard → SQL Editor:\n");
  console.log(sql);
  process.exit(1);
}

main().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
