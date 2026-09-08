import {
  IELTS_DIFFICULTIES,
  IELTS_MODULE_TYPES,
  IELTS_SKILLS,
} from "./constants";
import { parseAcceptedAnswers } from "./answers";

const QUESTION_TYPES = new Set([
  "multiple_choice",
  "true_false_not_given",
  "yes_no_not_given",
  "matching_headings",
  "matching_information",
  "matching_features",
  "matching",
  "sentence_completion",
  "summary_completion",
  "note_completion",
  "table_completion",
  "flow_chart_completion",
  "diagram_label_completion",
  "plan_map_diagram_labelling",
  "form_completion",
  "short_answer",
  "academic_task_1",
  "general_task_1",
  "task_2",
  "part_1",
  "part_2_cue_card",
  "part_3",
]);

export type ImportRowError = { row: number; message: string };

export function parseCsv(text: string): Record<string, string>[] {
  const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const headers = splitCsvLine(lines[0]).map((h) => h.trim().toLowerCase());
  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h] = cells[i] ?? "";
    });
    return row;
  });
}

function splitCsvLine(line: string): string[] {
  const out: string[] = [];
  let cur = "";
  let quoted = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') {
        cur += '"';
        i++;
      } else {
        quoted = !quoted;
      }
      continue;
    }
    if (ch === "," && !quoted) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out;
}

export function validateImportRow(row: Record<string, string>, index: number) {
  const errors: ImportRowError[] = [];
  const skill = row.skill?.trim().toLowerCase();
  const type = row.question_type?.trim().toLowerCase().replace(/[\s/-]+/g, "_");
  const ieltsType = (row.ielts_type || "academic").trim().toLowerCase();
  const difficulty = (row.difficulty || "medium").trim().toLowerCase();
  const question = row.question?.trim() || row.title?.trim();

  if (!IELTS_SKILLS.includes(skill as (typeof IELTS_SKILLS)[number])) {
    errors.push({ row: index, message: "Unknown skill" });
  }
  if (!QUESTION_TYPES.has(type)) {
    errors.push({ row: index, message: "Unknown question type" });
  }
  if (!IELTS_MODULE_TYPES.includes(ieltsType as (typeof IELTS_MODULE_TYPES)[number])) {
    errors.push({ row: index, message: "Unknown ielts_type" });
  }
  if (!IELTS_DIFFICULTIES.includes(difficulty as (typeof IELTS_DIFFICULTIES)[number])) {
    errors.push({ row: index, message: "Unknown difficulty" });
  }
  if (!question) errors.push({ row: index, message: "Missing question" });

  const objective = ![
    "academic_task_1",
    "general_task_1",
    "task_2",
    "part_1",
    "part_2_cue_card",
    "part_3",
  ].includes(type);
  if (objective && !row.correct_answer?.trim()) {
    errors.push({ row: index, message: "Missing correct_answer" });
  }

  const options = ["a", "b", "c", "d"]
    .map((letter) => {
      const text = row[`option_${letter}`]?.trim();
      return text ? { id: letter.toUpperCase(), text } : null;
    })
    .filter(Boolean) as { id: string; text: string }[];

  return {
    errors,
    payload: {
      title: (row.title || question || "Untitled").slice(0, 240),
      skill,
      ielts_type: ieltsType,
      section: row.section || null,
      question_type: type,
      difficulty,
      instructions: row.instructions || null,
      passage: row.passage || null,
      question_text: question,
      options: options.length ? options : null,
      correct_answer: row.correct_answer?.trim() || null,
      accepted_answers: parseAcceptedAnswers(row.accepted_answers),
      explanation: row.explanation || null,
      tags: parseAcceptedAnswers(row.tags),
      status: row.status === "published" ? "review" : row.status || "draft",
    },
  };
}
