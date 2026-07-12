import { AdminPageActions } from "@/components/admin/AdminPageActions";
import { PageHeader } from "@/components/common/PageHeader";
import { FilterableDataTable } from "@/components/tables/FilterableDataTable";
import { buildUniqueFilters } from "@/lib/table-helpers";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";

export default async function AdminCounselorsPage() {
  const t = await getTranslations("adminPages.counselors");
  const tCommon = await getTranslations("common");
  const supabase = await createClient();
  const { data } = await supabase
    .from("counselors")
    .select("*, profiles(full_name, email)")
    .order("created_at", { ascending: false });

  const rows = (data ?? []).map((r) => ({
    id: r.id,
    name: (r.profiles as { full_name?: string })?.full_name ?? "—",
    email: (r.profiles as { email?: string })?.email ?? "—",
    specialization: r.specialization ?? "—",
    is_active: String(r.is_active),
    isActive: r.is_active,
  }));

  return (
    <div>
      <PageHeader title={t("title")} description={t("description")}>
        <AdminPageActions href="/admin/counselors/new" label="New counselor" />
      </PageHeader>
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
            key: "specialization",
            title: t("columns.specialization"),
            dataIndex: "specialization",
            searchable: true,
            filters: buildUniqueFilters(rows.map((r) => r.specialization)),
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
            title: tCommon("actions"),
            cell: { type: "counselor-actions", nameKey: "name", activeKey: "isActive" },
          },
        ]}
        data={rows}
        emptyText={t("empty")}
      />
    </div>
  );
}
