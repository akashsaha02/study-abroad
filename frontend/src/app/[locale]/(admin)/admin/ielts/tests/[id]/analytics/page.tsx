import { PageHeader } from "@/components/common/PageHeader";
import { PageStack } from "@/components/common/PageStack";
import { StatCard } from "@/components/dashboard/StatCard";
import { createClient } from "@/lib/supabase/server";

export default async function AdminIeltsTestAnalyticsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: attempts } = await supabase
    .from("ielts_attempts")
    .select("*")
    .eq("test_id", id);
  const all = attempts ?? [];
  const done = all.filter((a) => a.status !== "in_progress");
  const avgBand =
    done.length
      ? done.reduce((s, a) => s + Number(a.estimated_band ?? 0), 0) / done.length
      : 0;

  return (
    <PageStack>
      <PageHeader compact title="Test analytics" description="Real attempt data only. Empty until students sit the test." />
      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard title="Attempts" value={all.length} />
        <StatCard title="Completed" value={done.length} />
        <StatCard
          title="Completion"
          value={all.length ? `${Math.round((done.length / all.length) * 100)}%` : "—"}
        />
        <StatCard title="Avg band" value={avgBand ? avgBand.toFixed(1) : "—"} />
      </div>
    </PageStack>
  );
}
