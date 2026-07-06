import { PageHeader } from "@/components/common/PageHeader";
import { StatusBadge } from "@/components/common/StatusBadge";
import { DataTable } from "@/components/tables/DataTable";
import { getUser } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";
import type { Lead } from "@/types";
import Link from "next/link";

export default async function CounselorLeadsPage() {
  const user = await getUser();
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .eq("assigned_counselor_id", user?.id)
    .order("created_at", { ascending: false });

  const columns = [
    {
      key: "name",
      header: "Name",
      cell: (row: Lead) => row.name,
    },
    { key: "phone", header: "Phone", cell: (row: Lead) => row.phone },
    {
      key: "status",
      header: "Status",
      cell: (row: Lead) => <StatusBadge status={row.status} />,
    },
    {
      key: "country",
      header: "Country",
      cell: (row: Lead) => row.preferred_country ?? "—",
    },
  ];

  return (
    <div>
      <PageHeader title="Assigned Leads" description="Manage your assigned leads." />
      <DataTable columns={columns} data={(leads as Lead[]) ?? []} emptyMessage="No assigned leads" />
    </div>
  );
}
