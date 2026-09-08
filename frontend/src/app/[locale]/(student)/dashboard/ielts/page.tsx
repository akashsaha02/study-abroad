import { EmptyState } from "@/components/common/EmptyState";
import { PageHeader } from "@/components/common/PageHeader";
import { PageStack } from "@/components/common/PageStack";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { IeltsStudentNav } from "@/features/ielts/components/IeltsStudentNav";
import { TargetBandForm } from "@/features/ielts/components/TargetBandForm";
import { PracticeStartForm } from "@/features/ielts/practice/PracticeStartForm";
import { Link } from "@/i18n/navigation";
import { getUser } from "@/infrastructure/auth/get-user";
import { createClient } from "@/lib/supabase/server";
import { Button } from "antd";
import {
  QUESTION_TYPE_LABELS,
  bandDescriptor,
  relatedOne,
} from "@abroadly/shared/ielts";

const SKILLS = ["listening", "reading", "writing", "speaking"] as const;

export default async function StudentIeltsPage() {
  const user = await getUser();
  if (!user) return null;
  const supabase = await createClient();
  const [{ data: attempts }, { data: settings }, { data: answers }] = await Promise.all([
    supabase
      .from("ielts_attempts")
      .select("*, ielts_tests(title, skill)")
      .eq("user_id", user.id)
      .order("started_at", { ascending: false })
      .limit(20),
    supabase.from("ielts_student_settings").select("target_band").eq("user_id", user.id).maybeSingle(),
    supabase
      .from("ielts_attempt_answers")
      .select("is_correct, ielts_questions(skill, question_type), ielts_attempts!inner(user_id)")
      .eq("ielts_attempts.user_id", user.id),
  ]);

  const done = (attempts ?? []).filter((a) =>
    ["completed", "submitted", "evaluating", "expired"].includes(a.status)
  );
  const current = Number(done[0]?.estimated_band) || 0;
  const practiced = answers?.length ?? 0;
  const accuracy =
    practiced > 0
      ? Math.round(
          ((answers ?? []).filter((a) => a.is_correct === true).length / practiced) * 100
        )
      : 0;
  const practiceMinutes = Math.round(
    (attempts ?? []).reduce((s, a) => s + (a.duration_seconds ?? 0), 0) / 60
  );

  const typeMap = new Map<string, { skill: string; correct: number; total: number }>();
  for (const row of answers ?? []) {
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
  const weakTypes = [...typeMap.entries()]
    .map(([type, s]) => ({ type, ...s, accuracy: s.correct / s.total }))
    .sort((a, b) => a.accuracy - b.accuracy);

  const skillCards = SKILLS.map((skill) => {
    const skillAttempts = done.filter((a) => {
      const test = relatedOne(
        a.ielts_tests as { title?: string; skill?: string } | { title?: string; skill?: string }[] | null
      );
      const scores = a.section_scores as Record<string, { band?: number; correct?: number; max?: number }> | null;
      return test?.skill === skill || Boolean(scores?.[skill]);
    });
    const last = skillAttempts[0];
    const scores = last?.section_scores as Record<string, { band?: number; correct?: number; max?: number }> | null;
    const band = Number(scores?.[skill]?.band ?? last?.estimated_band) || 0;
    const skillAnswers = (answers ?? []).filter((row) => {
      const q = relatedOne(
        row.ielts_questions as { skill?: string } | { skill?: string }[] | null
      );
      return q?.skill === skill;
    });
    const skillAccuracy =
      skillAnswers.length > 0
        ? Math.round(
            (skillAnswers.filter((a) => a.is_correct === true).length / skillAnswers.length) * 100
          )
        : null;
    const weakest = weakTypes.find((w) => w.skill === skill);
    return {
      skill,
      band,
      tests: skillAttempts.length,
      accuracy: skillAccuracy,
      weakest,
    };
  });

  const ranked = skillCards.filter((s) => s.band > 0).sort((a, b) => b.band - a.band);
  const strongest = ranked[0];
  const weakest = ranked[ranked.length - 1];

  return (
    <PageStack>
      <IeltsStudentNav />
      <PageHeader
        compact
        title="IELTS preparation"
        description="Learn → practice → sit tests → review weaknesses. Objective bands for Listening and Reading only."
      />
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Estimated band" value={current || "—"} description={bandDescriptor(current)} />
        <StatCard title="Target" value={settings?.target_band ?? "—"} />
        <StatCard title="Tests completed" value={done.length} />
        <StatCard
          title="Accuracy"
          value={practiced ? `${accuracy}%` : "—"}
          description={`${practiced} questions · ${practiceMinutes} min`}
        />
      </div>
      <div className="mt-4">
        <TargetBandForm initial={settings?.target_band ?? null} />
      </div>
      {(strongest || weakest) && (
        <p className="mt-3 text-sm text-muted-foreground">
          {strongest ? `Strongest: ${strongest.skill}. ` : null}
          {weakest && weakest !== strongest ? `Focus next: ${weakest.skill}.` : null}
        </p>
      )}
      <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {skillCards.map((card) => (
          <SurfaceCard key={card.skill} hover={false}>
            <h2 className="capitalize font-semibold">{card.skill}</h2>
            <p className="mt-2 text-2xl font-semibold tabular-nums">
              {card.band ? card.band.toFixed(1) : "—"}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {card.accuracy != null ? `${card.accuracy}% accuracy` : "No scored items yet"}
              {" · "}
              {card.tests} tests
            </p>
            {card.weakest ? (
              <p className="mt-2 text-sm">
                Weakest: {QUESTION_TYPE_LABELS[card.weakest.type] ?? card.weakest.type}
              </p>
            ) : (
              <p className="mt-2 text-sm text-muted-foreground">Practice to see a recommendation.</p>
            )}
            <Link
              className="mt-3 inline-block text-sm underline"
              href={`/dashboard/ielts/practice?skill=${card.skill}${
                card.weakest ? `&question_type=${card.weakest.type}` : ""
              }`}
            >
              Practice {card.skill}
            </Link>
          </SurfaceCard>
        ))}
      </div>
      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        <SurfaceCard hover={false}>
          <h2 className="mb-3 font-semibold">Start practice</h2>
          <PracticeStartForm />
        </SurfaceCard>
        <SurfaceCard hover={false}>
          <h2 className="mb-3 font-semibold">Next actions</h2>
          <div className="flex flex-col items-start gap-2">
            <Link href="/dashboard/ielts/mock-tests"><Button>Mock tests</Button></Link>
            <Link href="/dashboard/ielts/analytics"><Button>Analytics</Button></Link>
            <Link href="/ielts"><Button>Public IELTS guide</Button></Link>
          </div>
        </SurfaceCard>
      </div>
      <h2 className="mt-8 text-lg font-semibold">Recent activity</h2>
      {done.length === 0 ? (
        <EmptyState title="No attempts yet" description="Start a practice set to see progress here." />
      ) : (
        <ul className="divide-y rounded border">
          {done.slice(0, 8).map((a) => {
            const test = relatedOne(
              a.ielts_tests as { title?: string } | { title?: string }[] | null
            );
            return (
              <li key={a.id} className="flex justify-between p-3 text-sm">
                <span>{test?.title ?? a.kind}</span>
                <Link href={`/dashboard/ielts/results/${a.id}`}>
                  {a.estimated_band ? `Band ${a.estimated_band}` : a.status}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </PageStack>
  );
}
