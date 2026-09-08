import { PageHeader } from "@/components/common/PageHeader";
import { PageStack } from "@/components/common/PageStack";
import { StatCard } from "@/components/dashboard/StatCard";
import { Link } from "@/i18n/navigation";
import { Button } from "antd";
import { createClient } from "@/lib/supabase/server";
import { relatedOne } from "@abroadly/shared/ielts";

export default async function AdminIeltsOverviewPage() {
  const supabase = await createClient();
  const [questions, published, tests, attempts] = await Promise.all([
    supabase.from("ielts_questions").select("id", { count: "exact", head: true }),
    supabase
      .from("ielts_questions")
      .select("id", { count: "exact", head: true })
      .eq("status", "published"),
    supabase.from("ielts_tests").select("id", { count: "exact", head: true }),
    supabase
      .from("ielts_attempts")
      .select("estimated_band, status, started_at, ielts_tests(title)")
      .order("started_at", { ascending: false })
      .limit(12),
  ]);

  const recent = attempts.data ?? [];
  const bands = recent.map((a) => Number(a.estimated_band)).filter((b) => b > 0);
  const avg = bands.length ? bands.reduce((a, b) => a + b, 0) / bands.length : 0;

  return (
    <PageStack>
      <PageHeader
        compact
        title="IELTS"
        description="Question bank, tests, attempts, and analytics. Counts come from stored data — empty until students practice."
      />
      <div className="mb-6 flex flex-wrap gap-2">
        <Link href="/admin/ielts/questions"><Button>Questions</Button></Link>
        <Link href="/admin/ielts/questions/import"><Button>Import</Button></Link>
        <Link href="/admin/ielts/tests"><Button>Tests</Button></Link>
        <Link href="/admin/ielts/attempts"><Button>Attempts</Button></Link>
        <Link href="/admin/ielts/analytics"><Button>Analytics</Button></Link>
        <Link href="/admin/ielts/staff"><Button>Contributors</Button></Link>
        <Link href="/admin/ielts/settings"><Button>Settings</Button></Link>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Questions" value={questions.count ?? 0} />
        <StatCard title="Published" value={published.count ?? 0} />
        <StatCard title="Tests" value={tests.count ?? 0} />
        <StatCard title="Avg estimated band" value={avg ? avg.toFixed(1) : "—"} />
      </div>
      <h2 className="mt-8 text-lg font-semibold">Recent attempts</h2>
      <ul className="mt-2 divide-y rounded border">
        {recent.length === 0 && (
          <li className="p-4 text-sm text-muted-foreground">No attempts yet.</li>
        )}
        {recent.map((a) => {
          const test = relatedOne(
            a.ielts_tests as { title?: string } | { title?: string }[] | null
          );
          return (
            <li key={String(a.started_at)} className="flex justify-between p-3 text-sm">
              <span>{test?.title ?? "Practice"}</span>
              <span>
                {a.status}
                {a.estimated_band ? ` · band ${a.estimated_band}` : ""}
              </span>
            </li>
          );
        })}
      </ul>
    </PageStack>
  );
}
