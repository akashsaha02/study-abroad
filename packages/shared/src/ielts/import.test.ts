import assert from "node:assert/strict";
import test from "node:test";
import { parseCsv, validateImportRow } from "./import";

test("csv parser and validation", () => {
  const rows = parseCsv(
    `skill,ielts_type,question_type,difficulty,title,question,correct_answer
reading,academic,multiple_choice,easy,Q1,What is hydroponics?,B
listening,academic,unknown_type,easy,Q2,Room number?,12
writing,academic,task_2,medium,Essay,Discuss both views,`
  );
  assert.equal(rows.length, 3);

  const ok = validateImportRow(rows[0], 2);
  assert.equal(ok.errors.length, 0);

  const badType = validateImportRow(rows[1], 3);
  assert.ok(badType.errors.some((e) => e.message.includes("Unknown question type")));

  const writing = validateImportRow(rows[2], 4);
  assert.equal(writing.errors.length, 0);
});
