import { AdminPageActions } from "@/components/admin/AdminPageActions";
import { CounselorRowActions } from "@/components/admin/CounselorRowActions";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { createClient } from "@/lib/supabase/server";

export default async function AdminCounselorsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("counselors")
    .select("*, profiles(full_name, email)")
    .order("created_at", { ascending: false });

  type Row = NonNullable<typeof data>[0];

  const columns = [
    {
      key: "name",
      header: "Name",
      cell: (r: Row) => (r.profiles as { full_name?: string })?.full_name ?? "—",
    },
    {
      key: "email",
      header: "Email",
      cell: (r: Row) => (r.profiles as { email?: string })?.email ?? "—",
    },
    {
      key: "specialization",
      header: "Specialization",
      cell: (r: Row) => r.specialization ?? "—",
    },
    {
      key: "active",
      header: "Active",
      cell: (r: Row) => (r.is_active ? "Yes" : "No"),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (r: Row) => (
        <CounselorRowActions
          id={r.id}
          name={(r.profiles as { full_name?: string })?.full_name ?? "counselor"}
          isActive={r.is_active}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Counselors" description="Manage counselor accounts.">
        <AdminPageActions href="/admin/counselors/new" label="New counselor" />
      </PageHeader>
      <DataTable columns={columns} data={data ?? []} emptyMessage="No counselors" />
    </div>
  );
}
