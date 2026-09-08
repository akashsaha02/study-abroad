import { PageHeader } from "@/components/common/PageHeader";
import { PageStack } from "@/components/common/PageStack";
import { StatCard } from "@/components/dashboard/StatCard";
import { IeltsStudentNav } from "@/features/ielts/components/IeltsStudentNav";
import { getUser } from "@/infrastructure/auth/get-user";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import { QUESTION_TYPE_LABELS, relatedOne } from "@abroadly/shared/ielts";

export default async function StudentIeltsAnalyticsPage() {
  const user = await getUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data: attempts } = await supabase
    .from("ielts_attempts")
    .select("id, started_at, estimated_band, raw_score, max_score, duration_seconds, status, ielts_tests(title, skill)")
    .eq("user_id", user.id)
    .order("started_at", { ascending: false });

  const { data: typed } = await supabase
    .from("ielts_attempt_answers")
    .select("is_correct, ielts_questions(question_type, skill), ielts_attempts!inner(user_id)")
    .eq("ielts_attempts.user_id", user.id);

  const map = new Map<string, { total: number; correct: number; skill: string }>();
  for (const row of typed ?? []) {
    const q = relatedOne(
      row.ielts_questions as
        | { question_type?: string; skill?: string }
        | { question_type?: string; skill?: string }[]
        | null
    );
    if (!q?.question_type) continue;
    const cur = map.get(q.question_type) ?? { total: 0, correct: 0, skill: q.skill ?? "" };
    cur.total += 1;
    if (row.is_correct) cur.correct += 1;
    map.set(q.question_type, cur);
  }
  const weak = [...map.entries()]
    .map(([type, s]) => ({
      type,
      skill: s.skill,
      accuracy: s.correct / s.total,
      total: s.total,
    }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5);

  const done = (attempts ?? []).filter((a) => a.estimated_band);
  const current = Number(done[0]?.estimated_band) || 0;
  const trend = [...done].reverse().slice(-8);

  return (
    <PageStack>
      <IeltsStudentNav />
      <PageHeader compact title="IELTS analytics" description="Recommendations come from your stored answers." />
      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard title="Latest estimated band" value={current || "—"} />
        <StatCard title="Completed sessions" value={done.length} />
        <StatCard
          title="Practice time"
          value={`${Math.round((attempts ?? []).reduce((s, a) => s + (a.duration_seconds ?? 0), 0) / 60)} min`}
        />
      </div>
      {trend.length > 1 && (
        <>
          <h2 className="mt-8 text-lg font-semibold">Band over time</h2>
          <ol className="mt-2 flex flex-wrap gap-2">
            {trend.map((a, i) => (
              <li key={`${a.started_at}-${i}`} className="rounded border px-3 py-2 text-sm">
                {new Date(a.started_at).toLocaleDateString()} · {a.estimated_band}
              </li>
            ))}
          </ol>
        </>
      )}
      <h2 className="mt-8 text-lg font-semibold">Weak areas</h2>
      <ul className="mt-2 space-y-2">
        {weak.length === 0 && (
          <li className="text-sm text-muted-foreground">Practice more to see question-type weaknesses.</li>
        )}
        {weak.map((w) => (
          <li key={w.type} className="rounded border p-3 text-sm">
            <Link href={`/dashboard/ielts/practice?skill=${w.skill}&question_type=${w.type}`}>
              {QUESTION_TYPE_LABELS[w.type] ?? w.type} — {Math.round(w.accuracy * 100)}% ({w.total} items)
            </Link>
          </li>
        ))}
      </ul>
      <h2 className="mt-8 text-lg font-semibold">Attempts</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="p-2">Date</th>
            <th className="p-2">Test</th>
            <th className="p-2">Skill</th>
            <th className="p-2">Score</th>
            <th className="p-2">Band</th>
            <th className="p-2">Duration</th>
          </tr>
        </thead>
        <tbody>
          {(attempts ?? []).map((a, i) => {
            const test = relatedOne(
              a.ielts_tests as { title?: string; skill?: string } | { title?: string; skill?: string }[] | null
            );
            return (
              <tr key={`${a.started_at}-${i}`} className="border-b">
                <td className="p-2">{new Date(a.started_at).toLocaleString()}</td>
                <td className="p-2">
                  <Link href={`/dashboard/ielts/results/${a.id}`}>{test?.title ?? "Practice"}</Link>
                </td>
                <td className="p-2">{test?.skill ?? "—"}</td>
                <td className="p-2">{a.max_score ? `${a.raw_score}/${a.max_score}` : "—"}</td>
                <td className="p-2">{a.estimated_band ?? "—"}</td>
                <td className="p-2">{a.duration_seconds ? `${Math.round(a.duration_seconds / 60)} min` : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </PageStack>
  );
}
