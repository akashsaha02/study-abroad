import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

export default async function AdminStudentsPage() {
  const supabase = await createClient();
  const { data: students } = await supabase
    .from("students")
    .select("*, profiles(full_name, email, phone)")
    .order("created_at", { ascending: false });

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
      header: "Preferred Country",
      cell: (row: NonNullable<typeof students>[0]) => row.preferred_country ?? "—",
    },
    {
      key: "actions",
      header: "",
      cell: (row: NonNullable<typeof students>[0]) => (
        <Link href={`/admin/students/${row.id}`} className="text-sm text-primary hover:underline">
          View
        </Link>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Students" description="Manage student accounts." />
      <DataTable columns={columns} data={students ?? []} emptyMessage="No students yet" />
    </div>
  );
}
