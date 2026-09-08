import { IELTS_IMPORT_COLUMNS, parseCsv, validateImportRow } from "@abroadly/shared/ielts";
import { createQuestion } from "./questions.service";
import type { IeltsStaffRole } from "@abroadly/shared/ielts";
import type { AuthUser } from "@abroadly/shared/types";
import type { ImportRowError } from "@abroadly/shared/ielts";

export { parseCsv, validateImportRow };

export async function parseWorkbook(buffer: Buffer, filename: string) {
  if (filename.toLowerCase().endsWith(".csv")) {
    return parseCsv(buffer.toString("utf8"));
  }
  const xlsx = await import("xlsx");
  const wb = xlsx.read(buffer, { type: "buffer" });
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "" });
  return rows.map((row) => {
    const normalized: Record<string, string> = {};
    for (const [key, value] of Object.entries(row)) {
      normalized[key.trim().toLowerCase()] = String(value ?? "");
    }
    return normalized;
  });
}

export async function previewImport(buffer: Buffer, filename: string) {
  const rows = await parseWorkbook(buffer, filename);
  const valid: unknown[] = [];
  const errors: ImportRowError[] = [];
  rows.forEach((row, i) => {
    const result = validateImportRow(row, i + 2);
    if (result.errors.length) errors.push(...result.errors);
    else valid.push(result.payload);
  });
  return { validCount: valid.length, errorCount: errors.length, errors, valid };
}

export async function commitImport(
  buffer: Buffer,
  filename: string,
  staff: { user: AuthUser; staffRole: IeltsStaffRole | null }
) {
  const preview = await previewImport(buffer, filename);
  const created: string[] = [];
  for (const payload of preview.valid) {
    const row = await createQuestion(payload, staff);
    created.push(row.id);
  }
  return { created: created.length, errors: preview.errors };
}

export const IMPORT_TEMPLATE_HEADER = IELTS_IMPORT_COLUMNS.join(",");
