import { AdminPageActions } from "@/components/admin/AdminPageActions";
import { PageHeader } from "@/components/common/PageHeader";
import { FilterableDataTable } from "@/components/tables/FilterableDataTable";
import { buildPublishedFilters, buildUniqueFilters } from "@/lib/table-helpers";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";

export default async function AdminCoursesPage() {
  const t = await getTranslations("adminPages.courses");
  const tCommon = await getTranslations("common");
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("*, universities(name)")
    .order("title");

  const rows = (data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    university: (r.universities as { name?: string })?.name ?? "—",
    degree_level: r.degree_level ?? "—",
    is_published: String(r.is_published),
  }));

  return (
    <div>
      <PageHeader title={t("title")} description={t("description")}>
        <AdminPageActions href="/admin/courses/new" label="New course" />
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
            key: "university",
            title: t("columns.university"),
            dataIndex: "university",
            searchable: true,
            filters: buildUniqueFilters(rows.map((r) => r.university)),
          },
          {
            key: "level",
            title: t("columns.degree"),
            dataIndex: "degree_level",
            filters: buildUniqueFilters(rows.map((r) => r.degree_level)),
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
              apiPath: "/api/admin/courses",
              editPathTemplate: "/admin/courses/{id}/edit",
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
