import {
  answersMatch,
  isAttemptExpired,
  isObjectiveQuestionType,
  normalizeAnswer,
} from "@abroadly/shared/ielts";
import {
  ieltsAnswerSaveSchema,
  ieltsAttemptSaveSchema,
  ieltsPracticeStartSchema,
  ieltsReportSchema,
  ieltsTargetBandSchema,
} from "@abroadly/shared/validations/ielts";
import { createClient } from "@/infrastructure/supabase/client";
import { AppError, ForbiddenError, NotFoundError, ValidationError } from "@/shared/http/errors";
import {
  listeningBandFromRaw,
  overallFromSectionBands,
  readingBandFromRaw,
} from "./scoring.service";
import { WritingEvaluationService } from "./evaluation.service";
import { signedMediaUrl } from "./media.service";

function stripKeys<T extends Record<string, unknown>>(row: T, allowReview: boolean) {
  if (allowReview) return row;
  const {
    correct_answer: _c,
    accepted_answers: _a,
    explanation: _e,
    ...safe
  } = row as T & {
    correct_answer?: unknown;
    accepted_answers?: unknown;
    explanation?: unknown;
  };
  void _c;
  void _a;
  void _e;
  return safe;
}

async function getAttempt(id: string, userId: string, staff = false) {
  const supabase = createClient();
  const { data, error } = staff
    ? await supabase.from("ielts_attempts").select("*").eq("id", id).single()
    : await supabase.from("ielts_attempts").select("*").eq("id", id).eq("user_id", userId).single();
  if (error || !data) throw new NotFoundError("Attempt not found");
  const [{ data: answers }, { data: test }, { data: writing }, { data: speaking }] =
    await Promise.all([
      supabase.from("ielts_attempt_answers").select("*").eq("attempt_id", id),
      data.test_id
        ? supabase.from("ielts_tests").select("*").eq("id", data.test_id).maybeSingle()
        : Promise.resolve({ data: null }),
      supabase.from("ielts_writing_submissions").select("*").eq("attempt_id", id),
      supabase.from("ielts_speaking_submissions").select("*").eq("attempt_id", id),
    ]);
  return {
    ...data,
    ielts_attempt_answers: answers ?? [],
    ielts_tests: test,
    ielts_writing_submissions: writing ?? [],
    ielts_speaking_submissions: speaking ?? [],
  };
}

async function expireIfNeeded(attempt: {
  id: string;
  user_id: string;
  status: string;
  expires_at: string | null;
}) {
  if (attempt.status === "in_progress" && isAttemptExpired(attempt.expires_at)) {
    return submitAttempt(attempt.id, attempt.user_id, true);
  }
  return null;
}

function canReview(test: { review_policy?: string } | null, status: string) {
  if (!test) return status === "completed" || status === "submitted";
  if (test.review_policy === "never") return false;
  if (test.review_policy === "immediate") return true;
  return ["submitted", "completed", "evaluating"].includes(status);
}

export async function startPractice(userId: string, body: unknown) {
  const parsed = ieltsPracticeStartSchema.safeParse(body);
  if (!parsed.success) throw new ValidationError(parsed.error);

  const supabase = createClient();
  let q = supabase
    .from("ielts_questions")
    .select("id")
    .eq("status", "published")
    .eq("skill", parsed.data.skill)
    .limit(parsed.data.limit);

  if (parsed.data.question_type) q = q.eq("question_type", parsed.data.question_type);
  if (parsed.data.difficulty) q = q.eq("difficulty", parsed.data.difficulty);
  if (parsed.data.ielts_type && parsed.data.ielts_type !== "both") {
    q = q.in("ielts_type", [parsed.data.ielts_type, "both"]);
  }

  const { data: questions, error } = await q;
  if (error) throw new AppError(error.message, 500);
  if (!questions?.length) throw new ValidationError("No published questions match those filters");

  const shuffled = [...questions].sort(() => Math.random() - 0.5).slice(0, parsed.data.limit);
  return createAttempt(userId, {
    kind: "practice",
    questionIds: shuffled.map((row) => row.id),
    durationSeconds: Math.max(60, shuffled.length * 90),
    filters: parsed.data,
  });
}

export async function startTest(userId: string, testId: string) {
  const supabase = createClient();
  const { data: test, error } = await supabase
    .from("ielts_tests")
    .select("*, ielts_test_questions(question_id, sort_order)")
    .eq("id", testId)
    .eq("status", "published")
    .single();
  if (error || !test) throw new NotFoundError("Test not found");

  if (test.attempt_limit) {
    const { count } = await supabase
      .from("ielts_attempts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .eq("test_id", testId)
      .in("status", ["completed", "submitted", "evaluating", "in_progress"]);
    if ((count ?? 0) >= test.attempt_limit) {
      throw new ValidationError("Attempt limit reached");
    }
  }

  const questionIds = (test.ielts_test_questions ?? [])
    .sort((a: { sort_order: number }, b: { sort_order: number }) => a.sort_order - b.sort_order)
    .map((row: { question_id: string }) => row.question_id);

  return createAttempt(userId, {
    kind: test.kind === "full" ? "mock" : "skill_test",
    testId,
    questionIds,
    durationSeconds: test.duration_seconds,
  });
}

async function createAttempt(
  userId: string,
  opts: {
    kind: "practice" | "mock" | "skill_test";
    testId?: string;
    questionIds: string[];
    durationSeconds: number;
    filters?: unknown;
  }
) {
  const supabase = createClient();
  const started = new Date();
  const expires = new Date(started.getTime() + opts.durationSeconds * 1000);

  const { data: attempt, error } = await supabase
    .from("ielts_attempts")
    .insert({
      user_id: userId,
      test_id: opts.testId ?? null,
      kind: opts.kind,
      status: "in_progress",
      started_at: started.toISOString(),
      expires_at: expires.toISOString(),
      practice_filters: opts.filters ?? null,
    })
    .select("*")
    .single();
  if (error || !attempt) throw new AppError(error?.message ?? "Failed to start", 500);

  if (opts.questionIds.length) {
    const { error: aErr } = await supabase.from("ielts_attempt_answers").insert(
      opts.questionIds.map((question_id) => ({
        attempt_id: attempt.id,
        question_id,
      }))
    );
    if (aErr) throw new AppError(aErr.message, 500);
  }

  return loadAttemptPayload(attempt.id, userId);
}

export async function saveAnswers(attemptId: string, userId: string, body: unknown) {
  const parsed = ieltsAttemptSaveSchema.safeParse(body);
  if (!parsed.success) throw new ValidationError(parsed.error);
  const attempt = await getAttempt(attemptId, userId);
  if (attempt.status !== "in_progress") throw new ValidationError("Attempt is closed");
  if (attempt.expires_at && new Date(attempt.expires_at).getTime() < Date.now()) {
    await submitAttempt(attemptId, userId, true);
    throw new ValidationError("Time expired; attempt was submitted");
  }

  const supabase = createClient();
  for (const row of parsed.data.answers) {
    const item = ieltsAnswerSaveSchema.parse(row);
    await supabase
      .from("ielts_attempt_answers")
      .update({
        answer: item.answer ?? null,
        flagged: item.flagged ?? false,
        time_spent_ms: item.time_spent_ms ?? 0,
        answered_at: item.answer == null ? null : new Date().toISOString(),
      })
      .eq("attempt_id", attemptId)
      .eq("question_id", item.question_id);
  }

  return { success: true };
}

export async function submitAttempt(
  attemptId: string,
  userId: string | { id?: string },
  timedOut = false
) {
  const uid = typeof userId === "string" ? userId : "";
  const supabase = createClient();
  const attempt = await getAttempt(attemptId, uid || "00000000-0000-0000-0000-000000000000", !uid);
  if (!["in_progress", "submitted"].includes(attempt.status) && !timedOut) {
    return loadAttemptPayload(attemptId, attempt.user_id, true);
  }

  const questionIds = (attempt.ielts_attempt_answers ?? []).map(
    (row: { question_id: string }) => row.question_id
  );
  const { data: questions } = await supabase
    .from("ielts_questions")
    .select("*")
    .in("id", questionIds.length ? questionIds : ["00000000-0000-0000-0000-000000000000"]);

  const byId = new Map((questions ?? []).map((q) => [q.id, q]));
  let correct = 0;
  let max = 0;
  let pendingEval = false;
  const section: Record<string, { correct: number; max: number }> = {};

  for (const answer of attempt.ielts_attempt_answers ?? []) {
    const question = byId.get(answer.question_id);
    if (!question) continue;
    const skill = question.skill as string;
    section[skill] ??= { correct: 0, max: 0 };

    if (!isObjectiveQuestionType(question.question_type)) {
      pendingEval = true;
      if (question.skill === "writing") {
        const text = String(answer.answer ?? "");
        const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;
        const evaluation = await WritingEvaluationService.evaluate({
          prompt: question.prompt,
          content: text,
          wordCount,
        });
        await supabase.from("ielts_writing_submissions").upsert(
          {
            attempt_id: attemptId,
            question_id: question.id,
            content: text,
            word_count: wordCount,
            evaluation_status: evaluation.status,
          },
          { onConflict: "attempt_id,question_id" }
        );
      }
      continue;
    }

    const marks = Number(question.marks ?? 1);
    max += marks;
    section[skill].max += marks;
    const ok = answersMatch(
      answer.answer,
      question.correct_answer,
      question.accepted_answers,
      question.question_type
    );
    if (ok) {
      correct += marks;
      section[skill].correct += marks;
    }

    await supabase
      .from("ielts_attempt_answers")
      .update({
        is_correct: answer.answer == null || normalizeAnswer(answer.answer) === "" ? null : ok,
        marks_awarded: ok ? marks : 0,
      })
      .eq("id", answer.id);

    await bumpQuestionStats(question.id, answer.answer, ok, answer.time_spent_ms ?? 0);
  }

  const bands: number[] = [];
  const sectionScores: Record<string, unknown> = {};
  const moduleType =
    (attempt.ielts_tests?.ielts_type as "academic" | "general" | undefined) ?? "academic";

  for (const [skill, stats] of Object.entries(section)) {
    let band: number | null = null;
    if (skill === "listening") band = await listeningBandFromRaw(stats.correct, moduleType);
    if (skill === "reading") band = await readingBandFromRaw(stats.correct, moduleType);
    sectionScores[skill] = { ...stats, band };
    if (band) bands.push(band);
  }

  const status = pendingEval ? "evaluating" : timedOut ? "expired" : "completed";
  const estimated = overallFromSectionBands(bands);

  await supabase
    .from("ielts_attempts")
    .update({
      status,
      submitted_at: new Date().toISOString(),
      duration_seconds: Math.round(
        (Date.now() - new Date(attempt.started_at).getTime()) / 1000
      ),
      raw_score: correct,
      max_score: max,
      estimated_band: estimated || null,
      section_scores: sectionScores,
      updated_at: new Date().toISOString(),
    })
    .eq("id", attemptId);

  return loadAttemptPayload(attemptId, attempt.user_id, true);
}

async function bumpQuestionStats(
  questionId: string,
  answer: unknown,
  correct: boolean,
  timeMs: number
) {
  const supabase = createClient();
  const skipped = answer == null || normalizeAnswer(answer) === "";
  const { data } = await supabase
    .from("ielts_question_stats")
    .select("*")
    .eq("question_id", questionId)
    .maybeSingle();

  const next = {
    question_id: questionId,
    attempts: (data?.attempts ?? 0) + 1,
    correct_count: (data?.correct_count ?? 0) + (correct ? 1 : 0),
    incorrect_count: (data?.incorrect_count ?? 0) + (!skipped && !correct ? 1 : 0),
    skipped_count: (data?.skipped_count ?? 0) + (skipped ? 1 : 0),
    total_time_ms: (data?.total_time_ms ?? 0) + timeMs,
    updated_at: new Date().toISOString(),
  };

  await supabase.from("ielts_question_stats").upsert(next);
}

export async function loadAttemptPayload(
  attemptId: string,
  userId: string,
  submitted = false
) {
  const attempt = await getAttempt(attemptId, userId);
  await expireIfNeeded(attempt);
  const review = submitted || canReview(attempt.ielts_tests, attempt.status);

  const supabase = createClient();
  const ids = (attempt.ielts_attempt_answers ?? []).map(
    (row: { question_id: string }) => row.question_id
  );
  const { data: questions } = await supabase
    .from("ielts_questions")
    .select("*")
    .in("id", ids.length ? ids : ["00000000-0000-0000-0000-000000000000"]);

  const passageIds = [...new Set((questions ?? []).map((q: { passage_id: string | null }) => q.passage_id).filter(Boolean))] as string[];
  const { data: passages } = passageIds.length
    ? await supabase.from("ielts_passages").select("*").in("id", passageIds)
    : { data: [] };
  const passageMap = new Map((passages ?? []).map((p) => [p.id, p]));

  const mediaIds = (questions ?? [])
    .map((q: { media_id?: string | null }) => q.media_id)
    .filter(Boolean) as string[];
  const signed = await Promise.all(mediaIds.map((id) => signedMediaUrl(id)));
  const mediaMap = new Map(signed.filter(Boolean).map((m) => [m!.id, m]));

  const safeQuestions = (questions ?? []).map((q: Record<string, unknown>) => ({
    ...stripKeys(q, review),
    ielts_passages: q.passage_id ? passageMap.get(String(q.passage_id)) : null,
    media: q.media_id ? mediaMap.get(String(q.media_id)) : null,
  }));

  return { attempt, questions: safeQuestions, review };
}

export async function listMyAttempts(userId: string) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("ielts_attempts")
    .select("*, ielts_tests(title, skill, kind)")
    .eq("user_id", userId)
    .order("started_at", { ascending: false })
    .limit(50);
  if (error) throw new AppError(error.message, 500);
  return data ?? [];
}

export async function toggleBookmark(userId: string, questionId: string) {
  const supabase = createClient();
  const { data } = await supabase
    .from("ielts_bookmarks")
    .select("question_id")
    .eq("user_id", userId)
    .eq("question_id", questionId)
    .maybeSingle();
  if (data) {
    await supabase
      .from("ielts_bookmarks")
      .delete()
      .eq("user_id", userId)
      .eq("question_id", questionId);
    return { bookmarked: false };
  }
  await supabase.from("ielts_bookmarks").insert({ user_id: userId, question_id: questionId });
  return { bookmarked: true };
}

export async function reportQuestion(userId: string, questionId: string, body: unknown) {
  const parsed = ieltsReportSchema.safeParse(body);
  if (!parsed.success) throw new ValidationError(parsed.error);
  const supabase = createClient();
  const { error } = await supabase.from("ielts_question_reports").insert({
    user_id: userId,
    question_id: questionId,
    message: parsed.data.message,
  });
  if (error) throw new AppError(error.message, 500);
  return { success: true };
}

export async function saveTargetBand(userId: string, body: unknown) {
  const parsed = ieltsTargetBandSchema.safeParse(body);
  if (!parsed.success) throw new ValidationError(parsed.error);
  const supabase = createClient();
  const { error } = await supabase.from("ielts_student_settings").upsert({
    user_id: userId,
    target_band: parsed.data.target_band,
    updated_at: new Date().toISOString(),
  });
  if (error) throw new AppError(error.message, 500);
  return { success: true };
}

export async function saveSpeakingRecording(
  userId: string,
  attemptId: string,
  questionId: string,
  path: string,
  durationMs?: number
) {
  const attempt = await getAttempt(attemptId, userId);
  if (attempt.status !== "in_progress") throw new ForbiddenError();
  if (!path.startsWith(`${userId}/`)) throw new ValidationError("Invalid path");
  const supabase = createClient();
  const { error } = await supabase.from("ielts_speaking_submissions").upsert(
    {
      attempt_id: attemptId,
      question_id: questionId,
      storage_path: path,
      duration_ms: durationMs ?? null,
      evaluation_status: "pending",
    },
    { onConflict: "attempt_id,question_id" }
  );
  if (error) throw new AppError(error.message, 500);
  return { success: true };
}

export { expireIfNeeded };
