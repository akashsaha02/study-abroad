import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { createClient } from "@/lib/supabase/server";

export default async function AdminCounselorsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("counselors")
    .select("*, profiles(full_name, email)")
    .order("created_at", { ascending: false });
  const columns = [
    {
      key: "name",
      header: "Name",
      cell: (r: NonNullable<typeof data>[0]) =>
        (r.profiles as { full_name?: string })?.full_name ?? "—",
    },
    {
      key: "email",
      header: "Email",
      cell: (r: NonNullable<typeof data>[0]) =>
        (r.profiles as { email?: string })?.email ?? "—",
    },
    {
      key: "active",
      header: "Active",
      cell: (r: NonNullable<typeof data>[0]) => (r.is_active ? "Yes" : "No"),
    },
  ];
  return (
    <div>
      <PageHeader title="Counselors" description="Manage counselor accounts." />
      <DataTable columns={columns} data={data ?? []} emptyMessage="No counselors" />
    </div>
  );
}
