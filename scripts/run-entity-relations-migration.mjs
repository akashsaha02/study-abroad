/**
 * Applies Supabase SQL migrations via direct Postgres connection.
 * Requires password in .env.local (password=...) and NEXT_PUBLIC_SUPABASE_URL
 *
 * Usage: npm run migrate:entity-relations
 */

import { readdirSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pg from "pg";

const __dirname = dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = join(__dirname, "../supabase/migrations");

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

function loadMigrations() {
  return readdirSync(MIGRATIONS_DIR)
    .filter((file) => file.endsWith(".sql"))
    .sort()
    .map((file) => ({
      name: file,
      sql: readFileSync(join(MIGRATIONS_DIR, file), "utf8"),
    }));
}

function isBenignMigrationError(message) {
  const lower = message.toLowerCase();
  return (
    lower.includes("already exists") ||
    lower.includes("duplicate key") ||
    lower.includes("duplicate object")
  );
}

async function connectClient(candidates) {
  let lastError;
  for (const connectionString of candidates) {
    const client = new pg.Client({ connectionString, ssl: { rejectUnauthorized: false } });
    try {
      await client.connect();
      return client;
    } catch (err) {
      lastError = err;
      try {
        await client.end();
      } catch {
        /* ignore */
      }
    }
  }
  throw lastError ?? new Error("Could not connect to Postgres");
}

async function main() {
  const url = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
  const dbPassword = requireEnv("password");
  const ref = projectRefFromUrl(url);
  const encoded = encodeURIComponent(dbPassword);
  const migrations = loadMigrations();

  if (migrations.length === 0) {
    console.error("No migration files found in supabase/migrations");
    process.exit(1);
  }

  const candidates = [
    `postgresql://postgres:${encoded}@db.${ref}.supabase.co:5432/postgres`,
    `postgresql://postgres.${ref}:${encoded}@aws-0-ap-south-1.pooler.supabase.com:5432/postgres`,
    `postgresql://postgres.${ref}:${encoded}@aws-0-ap-south-1.pooler.supabase.com:6543/postgres`,
  ];

  let client;
  try {
    client = await connectClient(candidates);
    console.log("Connected. Applying migrations...\n");

    let hadFailure = false;
    for (const migration of migrations) {
      try {
        console.log(`→ ${migration.name}`);
        await client.query(migration.sql);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        if (isBenignMigrationError(message)) {
          console.log(`  skipped (already applied): ${message}`);
          continue;
        }
        hadFailure = true;
        console.error(`  failed: ${message}`);
      }
    }

    if (hadFailure) {
      console.error("\nSome migrations failed. See errors above.");
      process.exit(1);
    }

    console.log("\nAll migrations applied successfully.");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("Could not connect to Postgres:", message);
    console.error("\nApply these SQL files manually in Supabase Dashboard → SQL Editor:\n");
    for (const migration of migrations) {
      console.log(`-- ${migration.name}\n${migration.sql}\n`);
    }
    process.exit(1);
  } finally {
    await client?.end().catch(() => undefined);
  }
}

main().catch((err) => {
  console.error("Migration failed:", err.message);
  process.exit(1);
});
