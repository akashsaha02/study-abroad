import assert from "node:assert/strict";
import test from "node:test";
import { canEditQuestion, hasIeltsPermission } from "./permissions";
import { isAttemptExpired } from "./related";

test("platform admins have publish and staff permissions", () => {
  assert.equal(hasIeltsPermission("ielts.questions.publish", "admin", null), true);
  assert.equal(hasIeltsPermission("ielts.staff.manage", "super_admin", null), true);
  assert.equal(hasIeltsPermission("ielts.view", "student", null), false);
});

test("staff roles stay narrower than platform admin", () => {
  assert.equal(hasIeltsPermission("ielts.questions.create", "counselor", "editor"), true);
  assert.equal(hasIeltsPermission("ielts.questions.publish", "counselor", "editor"), false);
  assert.equal(hasIeltsPermission("ielts.questions.review", "counselor", "reviewer"), true);
  assert.equal(hasIeltsPermission("ielts.questions.create", "counselor", "reviewer"), false);
  assert.equal(hasIeltsPermission("ielts.questions.publish", "counselor", "manager"), true);
  assert.equal(hasIeltsPermission("ielts.staff.manage", "counselor", "manager"), false);
});

test("editors can only change their own drafts", () => {
  assert.equal(
    canEditQuestion("counselor", "editor", "author-1", "author-1", "draft"),
    true
  );
  assert.equal(
    canEditQuestion("counselor", "editor", "author-1", "other", "draft"),
    false
  );
  assert.equal(
    canEditQuestion("counselor", "editor", "author-1", "author-1", "published"),
    false
  );
});

test("attempt timeout uses stored expiry", () => {
  assert.equal(isAttemptExpired("2020-01-01T00:00:00.000Z", Date.parse("2020-01-02")), true);
  assert.equal(isAttemptExpired("2099-01-01T00:00:00.000Z", Date.parse("2020-01-02")), false);
  assert.equal(isAttemptExpired(null), false);
});
