import { PageHeader } from "@/components/common/PageHeader";
import { PageStack } from "@/components/common/PageStack";
import { StatCard } from "@/components/dashboard/StatCard";
import { IeltsStudentNav } from "@/features/ielts/components/IeltsStudentNav";
import { ExamWorkspace } from "@/features/ielts/components/ExamWorkspace";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/infrastructure/auth/get-user";
import { notFound } from "next/navigation";

export default async function StudentResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getUser();
  if (!user) notFound();
  const supabase = await createClient();
  const { data } = await supabase
    .from("ielts_attempts")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();
  if (!data) notFound();

  const scores = (data.section_scores ?? {}) as Record<
    string,
    { correct?: number; max?: number; band?: number }
  >;

  return (
    <PageStack>
      <IeltsStudentNav />
      <PageHeader
        compact
        title="IELTS result"
        description="Listening and Reading bands are estimated from raw scores. Writing and Speaking stay pending until a reviewer scores them."
      />
      <div className="grid gap-3 sm:grid-cols-4">
        <StatCard title="Estimated overall" value={data.estimated_band ?? "—"} />
        <StatCard
          title="Raw score"
          value={data.max_score ? `${data.raw_score}/${data.max_score}` : "—"}
        />
        <StatCard title="Status" value={data.status} />
        <StatCard
          title="Duration"
          value={data.duration_seconds ? `${Math.round(data.duration_seconds / 60)} min` : "—"}
        />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        {["listening", "reading", "writing", "speaking"].map((skill) => (
          <StatCard
            key={skill}
            title={skill}
            value={scores[skill]?.band ?? (skill === "writing" || skill === "speaking" ? "Pending" : "—")}
            description={
              scores[skill]?.max
                ? `${scores[skill]?.correct ?? 0}/${scores[skill]?.max}`
                : undefined
            }
          />
        ))}
      </div>
      <div className="mt-8">
        <ExamWorkspace attemptId={id} />
      </div>
    </PageStack>
  );
}
