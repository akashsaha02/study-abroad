import { relatedOne } from "@abroadly/shared/ielts";
import { createClient } from "@/infrastructure/supabase/client";
import { AppError } from "@/shared/http/errors";

export async function studentAnalytics(userId: string) {
  const supabase = createClient();
  const [{ data: attempts }, { data: settings }, { data: answers }] = await Promise.all([
    supabase
      .from("ielts_attempts")
      .select("*, ielts_tests(title, skill, kind)")
      .eq("user_id", userId)
      .order("started_at", { ascending: false }),
    supabase.from("ielts_student_settings").select("*").eq("user_id", userId).maybeSingle(),
    supabase
      .from("ielts_attempt_answers")
      .select("is_correct, question_id, time_spent_ms, ielts_attempts!inner(user_id)")
      .eq("ielts_attempts.user_id", userId),
  ]);

  const completed = (attempts ?? []).filter((a) =>
    ["completed", "submitted", "evaluating", "expired"].includes(a.status)
  );
  const bands = completed
    .map((a) => Number(a.estimated_band))
    .filter((b) => b > 0);
  const currentBand = bands[0] ?? 0;
  const totalTime = completed.reduce((s, a) => s + (a.duration_seconds ?? 0), 0);
  const practiced = (answers ?? []).length;
  const accuracy =
    practiced > 0
      ? (answers ?? []).filter((a) => a.is_correct === true).length / practiced
      : 0;

  const { data: typed } = await supabase
    .from("ielts_attempt_answers")
    .select(
      "is_correct, ielts_questions(question_type, skill), ielts_attempts!inner(user_id)"
    )
    .eq("ielts_attempts.user_id", userId);

  const typeMap = new Map<string, { skill: string; correct: number; total: number }>();
  for (const row of typed ?? []) {
    const q = relatedOne(
      row.ielts_questions as
        | { question_type?: string; skill?: string }
        | { question_type?: string; skill?: string }[]
        | null
    );
    if (!q?.question_type) continue;
    const cur = typeMap.get(q.question_type) ?? {
      skill: q.skill ?? "",
      correct: 0,
      total: 0,
    };
    cur.total += 1;
    if (row.is_correct) cur.correct += 1;
    typeMap.set(q.question_type, cur);
  }

  const weaknesses = [...typeMap.entries()]
    .map(([type, stats]) => ({
      question_type: type,
      skill: stats.skill,
      accuracy: stats.total ? stats.correct / stats.total : 0,
      total: stats.total,
    }))
    .filter((w) => w.total >= 1)
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5);

  const skillCards = ["listening", "reading", "writing", "speaking"].map((skill) => {
    const skillAttempts = completed.filter((a) => {
      const test = relatedOne(
        a.ielts_tests as { skill?: string } | { skill?: string }[] | null
      );
      const scores = a.section_scores as Record<string, unknown> | null;
      return test?.skill === skill || Boolean(scores?.[skill]);
    });
    const last = skillAttempts[0];
    const scores = last?.section_scores as Record<string, { band?: number }> | null;
    const band = Number(scores?.[skill]?.band ?? last?.estimated_band) || 0;
    return {
      skill,
      band,
      tests: skillAttempts.length,
      recommended: weaknesses.find((w) => w.skill === skill)?.question_type ?? null,
    };
  });

  return {
    currentBand,
    targetBand: settings?.target_band ?? null,
    testsCompleted: completed.length,
    questionsPracticed: practiced,
    practiceTimeSeconds: totalTime,
    accuracy,
    recent: completed.slice(0, 8),
    trend: completed
      .slice()
      .reverse()
      .map((a) => ({
        date: a.submitted_at ?? a.started_at,
        band: Number(a.estimated_band) || 0,
        accuracy:
          Number(a.max_score) > 0 ? Number(a.raw_score) / Number(a.max_score) : 0,
      })),
    weaknesses,
    skillCards,
    strongest: skillCards.slice().sort((a, b) => b.band - a.band)[0] ?? null,
    weakest: skillCards.slice().sort((a, b) => a.band - b.band)[0] ?? null,
  };
}

export async function adminAnalytics() {
  const supabase = createClient();
  const since = new Date(Date.now() - 7 * 86400000).toISOString();

  const [
    questions,
    published,
    tests,
    attempts,
    weekAttempts,
    completed,
  ] = await Promise.all([
    supabase.from("ielts_questions").select("id", { count: "exact", head: true }),
    supabase
      .from("ielts_questions")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase.from("ielts_tests").select("id", { count: "exact", head: true }),
    supabase.from("ielts_attempts").select("id", { count: "exact", head: true }),
    supabase
      .from("ielts_attempts")
      .select("id", { count: "exact", head: true })
      .gte("started_at", since),
    supabase
      .from("ielts_attempts")
      .select("estimated_band, raw_score, max_score, started_at, status, test_id, user_id")
      .in("status", ["completed", "submitted", "evaluating", "expired"]),
  ]);

  const scored = completed.data ?? [];
  const bands = scored.map((a) => Number(a.estimated_band)).filter((b) => b > 0);
  const avgBand = bands.length
    ? bands.reduce((a, b) => a + b, 0) / bands.length
    : 0;
  const accItems = scored.filter((a) => Number(a.max_score) > 0);
  const avgAccuracy = accItems.length
    ? accItems.reduce((s, a) => s + Number(a.raw_score) / Number(a.max_score), 0) /
      accItems.length
    : 0;

  const { data: low } = await supabase
    .from("ielts_question_stats")
    .select("*, ielts_questions(title, question_type, skill)")
    .gte("attempts", 3)
    .order("correct_count", { ascending: true })
    .limit(8);

  const { data: recentAttempts } = await supabase
    .from("ielts_attempts")
    .select("id, started_at, status, estimated_band, user_id, ielts_tests(title)")
    .order("started_at", { ascending: false })
    .limit(10);

  const { data: recentQuestions } = await supabase
    .from("ielts_questions")
    .select("id, title, skill, question_type, status, created_at")
    .order("created_at", { ascending: false })
    .limit(8);

  const { count: students } = await supabase
    .from("ielts_attempts")
    .select("user_id", { count: "exact", head: true });

  return {
    totalQuestions: questions.count ?? 0,
    publishedQuestions: published.count ?? 0,
    tests: tests.count ?? 0,
    attempts: attempts.count ?? 0,
    attemptsThisWeek: weekAttempts.count ?? 0,
    testsCompleted: scored.length,
    averageBand: avgBand,
    averageAccuracy: avgAccuracy,
    ieltsStudents: students ?? 0,
    lowPerforming: low ?? [],
    recentAttempts: recentAttempts ?? [],
    recentQuestions: recentQuestions ?? [],
    bandDistribution: [4, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map((band) => ({
      band,
      count: bands.filter((b) => b === band).length,
    })),
  };
}

export async function testAnalytics(testId: string) {
  const supabase = createClient();
  const { data: attempts, error } = await supabase
    .from("ielts_attempts")
    .select("*")
    .eq("test_id", testId);
  if (error) throw new AppError(error.message, 500);
  const all = attempts ?? [];
  const finished = all.filter((a) => a.status !== "in_progress");
  const scores = finished.map((a) => Number(a.raw_score) || 0);
  const bands = finished.map((a) => Number(a.estimated_band)).filter((b) => b > 0);
  return {
    totalAttempts: all.length,
    completionRate: all.length ? finished.length / all.length : 0,
    averageScore: scores.length ? scores.reduce((a, b) => a + b, 0) / scores.length : 0,
    averageBand: bands.length ? bands.reduce((a, b) => a + b, 0) / bands.length : 0,
    averageDuration:
      finished.length
        ? finished.reduce((s, a) => s + (a.duration_seconds ?? 0), 0) / finished.length
        : 0,
    attempts: finished.slice(0, 50),
  };
}

export async function studentDashboard(userId: string) {
  return studentAnalytics(userId);
}
