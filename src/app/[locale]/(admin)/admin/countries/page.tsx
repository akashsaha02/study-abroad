import { AdminPageActions } from "@/components/admin/AdminPageActions";
import { PageHeader } from "@/components/common/PageHeader";
import { FilterableDataTable } from "@/components/tables/FilterableDataTable";
import { buildPublishedFilters } from "@/lib/table-helpers";
import { createClient } from "@/lib/supabase/server";
import { getLocale, getTranslations } from "next-intl/server";

async function getContent(table: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from(table)
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function AdminCountriesPage() {
  const t = await getTranslations("adminPages.countries");
  const tCommon = await getTranslations("common");
  const locale = await getLocale();
  const dateLocale = locale === "bn" ? "bn-BD" : "en-US";
  const countries = await getContent("countries");

  const rows = countries.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    is_published: String(r.is_published),
    created_at: r.created_at,
  }));

  return (
    <div>
      <PageHeader title={t("title")} description={t("description")}>
        <AdminPageActions href="/admin/countries/new" label="New country" />
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
            key: "slug",
            title: t("columns.slug"),
            dataIndex: "slug",
            searchable: true,
          },
          {
            key: "published",
            title: t("columns.published"),
            dataIndex: "is_published",
            filters: buildPublishedFilters(tCommon),
            cell: { type: "published" },
          },
          {
            key: "created",
            title: t("columns.created"),
            dataIndex: "created_at",
            sortable: "date",
            cell: { type: "date", locale: dateLocale },
          },
          {
            key: "actions",
            title: tCommon("actions"),
            cell: {
              type: "resource-actions",
              apiPath: "/api/admin/countries",
              editPathTemplate: "/admin/countries/{id}/edit",
              publishedKey: "is_published",
              nameKey: "name",
            },
          },
        ]}
        data={rows}
        emptyText={t("empty")}
      />
    </div>
  );
}
