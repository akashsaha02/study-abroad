import { UserRowActions } from "@/components/admin/UserRowActions";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { requireRole } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";

export default async function AdminUsersPage() {
  await requireRole(["super_admin"]);

  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const columns = [
    {
      key: "name",
      header: "Name",
      cell: (r: Profile) => r.full_name ?? "—",
    },
    {
      key: "email",
      header: "Email",
      cell: (r: Profile) => r.email ?? "—",
    },
    {
      key: "active",
      header: "Active",
      cell: (r: Profile) => (r.is_active ? "Yes" : "No"),
    },
    {
      key: "actions",
      header: "Actions",
      cell: (r: Profile) => (
        <UserRowActions userId={r.id} currentRole={r.role} isActive={r.is_active} />
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Users" description="Manage user roles and access (super admin only)." />
      <DataTable columns={columns} data={(data as Profile[]) ?? []} emptyMessage="No users" />
    </div>
  );
}
