const TFNG = new Set(["true", "false", "not given", "t", "f", "ng"]);
const YNNG = new Set(["yes", "no", "not given", "y", "n", "ng"]);

export function normalizeAnswer(value: unknown): string {
  if (value == null) return "";
  return String(value)
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

export function parseAcceptedAnswers(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(normalizeAnswer).filter(Boolean);
  }
  if (typeof value === "string") {
    return value
      .split(/[|;,]/)
      .map(normalizeAnswer)
      .filter(Boolean);
  }
  return [];
}

export function isObjectiveQuestionType(questionType: string): boolean {
  return !["academic_task_1", "general_task_1", "task_2", "part_1", "part_2_cue_card", "part_3"].includes(
    questionType
  );
}

function aliases(questionType: string, answer: string): string[] {
  const n = normalizeAnswer(answer);
  if (questionType === "true_false_not_given") {
    if (n === "t") return ["true"];
    if (n === "f") return ["false"];
    if (n === "ng") return ["not given"];
  }
  if (questionType === "yes_no_not_given") {
    if (n === "y") return ["yes"];
    if (n === "n") return ["no"];
    if (n === "ng") return ["not given"];
  }
  return [n];
}

export function answersMatch(
  given: unknown,
  correct: string | null | undefined,
  accepted: string[] | null | undefined,
  questionType: string
): boolean {
  const givenNorms = aliases(questionType, String(given ?? ""));
  if (!givenNorms[0]) return false;

  const pool = new Set([
    ...aliases(questionType, correct ?? ""),
    ...(accepted ?? []).flatMap((a) => aliases(questionType, a)),
  ]);
  pool.delete("");

  if (questionType === "true_false_not_given") {
    return givenNorms.some((g) => TFNG.has(g) && pool.has(g));
  }
  if (questionType === "yes_no_not_given") {
    return givenNorms.some((g) => YNNG.has(g) && pool.has(g));
  }

  return givenNorms.some((g) => pool.has(g));
}
