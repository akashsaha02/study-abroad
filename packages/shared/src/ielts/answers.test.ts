import assert from "node:assert/strict";
import test from "node:test";
import { answersMatch, normalizeAnswer, parseAcceptedAnswers } from "./answers";

test("normalize trims and collapses space", () => {
  assert.equal(normalizeAnswer("  Hydroponics  "), "hydroponics");
  assert.equal(normalizeAnswer("Not   Given"), "not given");
});

test("accepted answers split", () => {
  assert.deepEqual(parseAcceptedAnswers("LED|led lighting"), [
    "led",
    "led lighting",
  ]);
});

test("multiple choice and aliases", () => {
  assert.equal(answersMatch("B", "B", [], "multiple_choice"), true);
  assert.equal(answersMatch("true", "T", [], "true_false_not_given"), true);
  assert.equal(answersMatch("NG", "Not Given", [], "true_false_not_given"), true);
  assert.equal(answersMatch("yes", "Yes", [], "yes_no_not_given"), true);
  assert.equal(answersMatch("wrong", "hydroponics", ["hydroponic"], "short_answer"), false);
  assert.equal(
    answersMatch("Hydroponics", "hydroponics", [], "sentence_completion"),
    true
  );
});
