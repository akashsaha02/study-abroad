/**
 * Detects whether entity-relation FK columns exist (migration applied).
 */

export async function detectFkColumns(admin) {
  const checks = [
    ["testimonials", "country_id"],
    ["testimonials", "university_id"],
    ["cost_settings", "country_id"],
    ["eligibility_rules", "country_id"],
    ["leads", "preferred_country_id"],
    ["students", "preferred_country_id"],
  ];

  const result = {};
  for (const [table, column] of checks) {
    const key = `${table}.${column}`;
    const { error } = await admin.from(table).select(column).limit(1);
    result[key] = !error;
  }
  return result;
}

export function hasFk(fks, table, column) {
  return fks[`${table}.${column}`] === true;
}

/** Remove FK fields from payload when columns are not migrated yet. */
export function applyFkPayload(fks, payload, fields) {
  const row = { ...payload };
  for (const [table, column] of fields) {
    if (!hasFk(fks, table, column) && column in row) {
      delete row[column];
    }
  }
  return row;
}

export function warnIfMigrationMissing(fks) {
  const required = [
    "testimonials.country_id",
    "cost_settings.country_id",
    "eligibility_rules.country_id",
  ];
  const missing = required.filter((k) => !fks[k]);
  if (missing.length === 0) return;

  console.warn("\n⚠ Entity-relations migration not applied. Missing columns:");
  for (const col of missing) console.warn(`   - ${col}`);
  console.warn("\n  Run in Supabase Dashboard → SQL Editor:");
  console.warn("  supabase/migrations/20250707000000_entity_relations_fks.sql");
  console.warn("  Or: npm run migrate:entity-relations\n");
  console.warn("  Seeding will continue using text fields only.\n");
}
