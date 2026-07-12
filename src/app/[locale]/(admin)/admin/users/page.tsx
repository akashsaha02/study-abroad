import { PageHeader } from "@/components/common/PageHeader";
import { FilterableDataTable } from "@/components/tables/FilterableDataTable";
import { requireRole } from "@/lib/auth/get-user";
import { buildUniqueFilters } from "@/lib/table-helpers";
import { createClient } from "@/lib/supabase/server";
import type { Profile } from "@/types";
import { getTranslations } from "next-intl/server";

export default async function AdminUsersPage() {
  await requireRole(["super_admin"]);

  const t = await getTranslations("adminPages.users");
  const tCommon = await getTranslations("common");
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = ((data as Profile[]) ?? []).map((r) => ({
    id: r.id,
    name: r.full_name ?? "—",
    email: r.email ?? "—",
    role: r.role,
    is_active: String(r.is_active),
    isActive: r.is_active,
    currentRole: r.role,
  }));

  return (
    <div>
      <PageHeader title={t("title")} description={t("description")} />
      <FilterableDataTable
        columns={[
          {
            key: "name",
            title: t("columns.name"),
            dataIndex: "name",
            searchable: true,
            sortable: true,
          },
          {
            key: "email",
            title: t("columns.email"),
            dataIndex: "email",
            searchable: true,
          },
          {
            key: "role",
            title: t("columns.role"),
            dataIndex: "role",
            filters: buildUniqueFilters(rows.map((r) => r.role)),
          },
          {
            key: "active",
            title: t("columns.active"),
            dataIndex: "is_active",
            filters: [
              { text: tCommon("yes"), value: "true" },
              { text: tCommon("no"), value: "false" },
            ],
            cell: { type: "yesNo" },
          },
          {
            key: "actions",
            title: t("columns.actions"),
            cell: { type: "user-actions", roleKey: "currentRole", activeKey: "isActive" },
          },
        ]}
        data={rows}
        emptyText={t("empty")}
      />
    </div>
  );
}
