import { AdminPageActions } from "@/components/admin/AdminPageActions";
import { PageHeader } from "@/components/common/PageHeader";
import { FilterableDataTable } from "@/components/tables/FilterableDataTable";
import { buildPublishedFilters } from "@/lib/table-helpers";
import { createClient } from "@/lib/supabase/server";
import { getLocale, getTranslations } from "next-intl/server";

export default async function AdminScholarshipsPage() {
  const t = await getTranslations("adminPages.scholarships");
  const tCommon = await getTranslations("common");
  const locale = await getLocale();
  const dateLocale = locale === "bn" ? "bn-BD" : "en-US";
  const supabase = await createClient();
  const { data } = await supabase.from("scholarships").select("*").order("title");

  const rows = (data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    amount: r.amount ?? "—",
    deadline: r.deadline ?? "",
    is_published: String(r.is_published),
  }));

  return (
    <div>
      <PageHeader title={t("title")} description={t("description")}>
        <AdminPageActions href="/admin/scholarships/new" label="New scholarship" />
      </PageHeader>
      <FilterableDataTable
        columns={[
          {
            key: "title",
            title: t("columns.name"),
            dataIndex: "title",
            searchable: true,
            sortable: true,
          },
          {
            key: "amount",
            title: t("columns.amount"),
            dataIndex: "amount",
            sortable: true,
          },
          {
            key: "deadline",
            title: "Deadline",
            dataIndex: "deadline",
            sortable: "date",
            cell: { type: "date", locale: dateLocale },
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
              apiPath: "/api/admin/scholarships",
              editPathTemplate: "/admin/scholarships/{id}/edit",
              publishedKey: "is_published",
              nameKey: "title",
            },
          },
        ]}
        data={rows}
        emptyText={t("empty")}
      />
    </div>
  );
}
