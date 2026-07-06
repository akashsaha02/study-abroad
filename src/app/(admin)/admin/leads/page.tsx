import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable } from "@/components/tables/DataTable";
import { getLeads } from "@/lib/services/leads";
import type { Lead } from "@/types";
import Link from "next/link";

export default async function AdminLeadsPage() {
  const leads = await getLeads();

  const columns = [
    {
      key: "name",
      header: "Name",
      cell: (row: Lead) => (
        <Link href={`/admin/leads/${row.id}`} className="font-medium hover:underline">
          {row.name}
        </Link>
      ),
    },
    { key: "phone", header: "Phone", cell: (row: Lead) => row.phone },
    {
      key: "country",
      header: "Country",
      cell: (row: Lead) => row.preferred_country ?? "—",
    },
    { key: "source", header: "Source", cell: (row: Lead) => row.source },
    {
      key: "status",
      header: "Status",
      cell: (row: Lead) => <StatusBadge status={row.status} />,
    },
    {
      key: "date",
      header: "Created",
      cell: (row: Lead) => new Date(row.created_at).toLocaleDateString(),
    },
  ];

  return (
    <div>
      <PageHeader title="Leads" description="Manage all incoming leads." />
      <DataTable columns={columns} data={leads} emptyMessage="No leads yet" />
    </div>
  );
}
