import { AdminPageActions } from "@/components/admin/AdminPageActions";
import { PageHeader } from "@/components/common/PageHeader";
import { FilterableDataTable } from "@/components/tables/FilterableDataTable";
import { buildPublishedFilters, buildUniqueFilters } from "@/lib/table-helpers";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";

export default async function AdminFaqsPage() {
  const t = await getTranslations("adminPages.faqs");
  const tCommon = await getTranslations("common");
  const supabase = await createClient();
  const { data } = await supabase.from("faqs").select("*").order("sort_order");

  const rows = (data ?? []).map((r) => ({
    id: r.id,
    question: r.question,
    category: r.category ?? "—",
    is_published: String(r.is_published),
  }));

  return (
    <div>
      <PageHeader title={t("title")} description={t("description")}>
        <AdminPageActions href="/admin/faqs/new" label="New FAQ" />
      </PageHeader>
      <FilterableDataTable
        columns={[
          {
            key: "question",
            title: t("columns.question"),
            dataIndex: "question",
            searchable: true,
            sortable: true,
          },
          {
            key: "category",
            title: t("columns.category"),
            dataIndex: "category",
            filters: buildUniqueFilters(rows.map((r) => r.category)),
          },
          {
            key: "published",
            title: t("columns.published"),
            dataIndex: "is_published",
            filters: buildPublishedFilters(tCommon),
            cell: { type: "published" },
          },
          {
            key: "actions",
            title: tCommon("actions"),
            cell: {
              type: "resource-actions",
              apiPath: "/api/admin/faqs",
              editPathTemplate: "/admin/faqs/{id}/edit",
              publishedKey: "is_published",
              nameKey: "question",
            },
          },
        ]}
        data={rows}
        emptyText={t("empty")}
      />
    </div>
  );
}
