import { PageHeader } from "@/components/common/PageHeader";
import { PageStack } from "@/components/common/PageStack";
import { StatCard } from "@/components/dashboard/StatCard";
import { createClient } from "@/lib/supabase/server";
import { relatedOne } from "@abroadly/shared/ielts";
import { Link } from "@/i18n/navigation";

export default async function AdminIeltsAnalyticsPage() {
  const supabase = await createClient();
  const [{ data: stats }, { data: completed }] = await Promise.all([
    supabase
      .from("ielts_question_stats")
      .select("question_id, attempts, correct_count, incorrect_count, skipped_count, ielts_questions(title, question_type, skill)")
      .gte("attempts", 1)
      .order("attempts", { ascending: false })
      .limit(20),
    supabase
      .from("ielts_attempts")
      .select("estimated_band, status")
      .in("status", ["completed", "submitted", "evaluating", "expired"]),
  ]);

  const bands = (completed ?? [])
    .map((a) => Number(a.estimated_band))
    .filter((b) => b > 0);
  const distribution = [4, 5, 5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9].map((band) => ({
    band,
    count: bands.filter((b) => b === band).length,
  }));

  return (
    <PageStack>
      <PageHeader
        compact
        title="IELTS analytics"
        description="Question difficulty is inferred from real attempts. Nothing is fabricated."
      />
      <div className="grid gap-3 sm:grid-cols-2">
        <StatCard title="Tracked questions" value={stats?.length ?? 0} />
        <StatCard title="Scored attempts" value={completed?.length ?? 0} />
      </div>
      <h2 className="mt-8 text-lg font-semibold">Band distribution</h2>
      <ul className="mt-2 flex flex-wrap gap-2">
        {distribution.map((d) => (
          <li key={d.band} className="rounded border px-3 py-2 text-sm">
            {d.band}: {d.count}
          </li>
        ))}
      </ul>
      <h2 className="mt-8 text-lg font-semibold">Question performance</h2>
      <table className="mt-2 w-full text-sm">
        <thead>
          <tr className="border-b text-left">
            <th className="p-2">Question</th>
            <th className="p-2">Type</th>
            <th className="p-2">Attempts</th>
            <th className="p-2">Accuracy</th>
          </tr>
        </thead>
        <tbody>
          {(stats ?? []).map((row) => {
            const question = relatedOne(
              row.ielts_questions as
                | { title?: string; question_type?: string }
                | { title?: string; question_type?: string }[]
                | null
            );
            const accuracy = row.attempts
              ? `${Math.round((row.correct_count / row.attempts) * 100)}%`
              : "—";
            return (
              <tr key={row.question_id} className="border-b">
                <td className="p-2">{question?.title}</td>
                <td className="p-2">{question?.question_type}</td>
                <td className="p-2">{row.attempts}</td>
                <td className="p-2">{accuracy}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <p className="mt-4 text-sm">
        <Link href="/admin/ielts/tests">Open tests for per-test analytics</Link>
      </p>
    </PageStack>
  );
}
