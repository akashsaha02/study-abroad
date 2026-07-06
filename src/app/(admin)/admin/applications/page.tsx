import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable } from "@/components/tables/DataTable";
import { createClient } from "@/lib/supabase/server";
import Link from "next/link";

type ApplicationRow = {
  id: string;
  status: string;
  students?: { profiles?: { full_name?: string } } | null;
  universities?: { name?: string } | null;
  countries?: { name?: string } | null;
};

export default async function AdminApplicationsPage() {
  const supabase = await createClient();
  const { data: applications } = await supabase
    .from("applications")
    .select("*, students(profile_id, profiles(full_name)), universities(name), countries(name)")
    .order("created_at", { ascending: false });

  const rows = (applications ?? []) as ApplicationRow[];

  const columns = [
    {
      key: "student",
      header: "Student",
      cell: (row: ApplicationRow) => row.students?.profiles?.full_name ?? "—",
    },
    {
      key: "university",
      header: "University",
      cell: (row: ApplicationRow) => row.universities?.name ?? "—",
    },
    {
      key: "country",
      header: "Country",
      cell: (row: ApplicationRow) => row.countries?.name ?? "—",
    },
    {
      key: "status",
      header: "Status",
      cell: (row: ApplicationRow) => <StatusBadge status={row.status} />,
    },
    {
      key: "actions",
      header: "",
      cell: (row: ApplicationRow) => (
        <Link href={`/admin/applications/${row.id}`} className="text-sm text-primary hover:underline">
          View
        </Link>
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Applications" description="Manage all student applications." />
      <DataTable
        columns={columns}
        data={rows}
        emptyMessage="No applications yet"
      />
    </div>
  );
}
