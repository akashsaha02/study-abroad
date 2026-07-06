import { PageHeader } from "@/components/common/PageHeader";
import { StatCard } from "@/components/dashboard/StatCard";
import { getUser } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";

export default async function CounselorDashboardPage() {
  const user = await getUser();
  const supabase = await createClient();

  const [leadsRes, studentsRes, appsRes] = await Promise.all([
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .eq("assigned_counselor_id", user?.id),
    supabase
      .from("students")
      .select("id", { count: "exact", head: true })
      .eq("assigned_counselor_id", user?.id),
    supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("counselor_id", user?.id),
  ]);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Counselor Overview"
        description="Your assigned leads, students, and applications."
      />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Assigned Leads" value={leadsRes.count ?? 0} />
        <StatCard title="Assigned Students" value={studentsRes.count ?? 0} />
        <StatCard title="Applications" value={appsRes.count ?? 0} />
      </div>
    </div>
  );
}
