import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { getUser } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";

export default async function CounselorStudentsPage() {
  const user = await getUser();
  const supabase = await createClient();
  const { data: students } = await supabase
    .from("students")
    .select("*, profiles(full_name, email)")
    .eq("assigned_counselor_id", user?.id);

  const columns = [
    {
      key: "name",
      header: "Name",
      cell: (row: NonNullable<typeof students>[0]) =>
        (row.profiles as { full_name?: string })?.full_name ?? "—",
    },
    {
      key: "email",
      header: "Email",
      cell: (row: NonNullable<typeof students>[0]) =>
        (row.profiles as { email?: string })?.email ?? "—",
    },
    {
      key: "country",
      header: "Country",
      cell: (row: NonNullable<typeof students>[0]) => row.preferred_country ?? "—",
    },
  ];

  return (
    <div>
      <PageHeader title="Assigned Students" description="View and support your students." />
      <DataTable columns={columns} data={students ?? []} emptyMessage="No assigned students" />
    </div>
  );
}
