import assert from "node:assert/strict";
import test from "node:test";
import {
  calculateListeningBand,
  calculateOverallBand,
  calculateReadingBand,
  calculateRawScore,
  roundToBand,
} from "./scoring";

test("listening band conversion", () => {
  assert.equal(calculateListeningBand(40), 9);
  assert.equal(calculateListeningBand(30), 7);
  assert.equal(calculateListeningBand(23), 6);
  assert.equal(calculateListeningBand(0), 2.5);
});

test("academic vs general reading bands differ", () => {
  assert.equal(calculateReadingBand(30, "academic"), 7);
  assert.equal(calculateReadingBand(30, "general"), 6);
});

test("official overall rounding", () => {
  assert.equal(roundToBand(6.24), 6);
  assert.equal(roundToBand(6.25), 6.5);
  assert.equal(roundToBand(6.74), 6.5);
  assert.equal(roundToBand(6.75), 7);
  assert.equal(calculateOverallBand([6, 6.5, 7, 7]), 6.5);
});

test("raw score accuracy", () => {
  assert.equal(calculateRawScore(18, 40).correct, 18);
  assert.equal(calculateRawScore(20, 40).accuracy, 0.5);
});
