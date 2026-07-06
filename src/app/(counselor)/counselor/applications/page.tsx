import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable } from "@/components/tables/DataTable";
import { getUser } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";

export default async function CounselorApplicationsPage() {
  const user = await getUser();
  const supabase = await createClient();
  const { data: applications } = await supabase
    .from("applications")
    .select("*, students(profiles(full_name)), universities(name)")
    .eq("counselor_id", user?.id);

  const columns = [
    {
      key: "student",
      header: "Student",
      cell: (row: NonNullable<typeof applications>[0]) =>
        (row.students as { profiles?: { full_name?: string } })?.profiles?.full_name ?? "—",
    },
    {
      key: "university",
      header: "University",
      cell: (row: NonNullable<typeof applications>[0]) =>
        (row.universities as { name?: string })?.name ?? "—",
    },
    {
      key: "status",
      header: "Status",
      cell: (row: NonNullable<typeof applications>[0]) => (
        <StatusBadge status={row.status} />
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Applications" description="Track assigned applications." />
      <DataTable columns={columns} data={applications ?? []} emptyMessage="No applications" />
    </div>
  );
}
