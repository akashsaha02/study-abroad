import { AdminPageActions } from "@/components/admin/AdminPageActions";
import { PageHeader } from "@/components/common/PageHeader";
import { FilterableDataTable } from "@/components/tables/FilterableDataTable";
import { buildPublishedFilters, buildUniqueFilters } from "@/lib/table-helpers";
import { createClient } from "@/lib/supabase/server";
import { getLocale, getTranslations } from "next-intl/server";

export default async function AdminTestimonialsPage() {
  const t = await getTranslations("adminPages.testimonials");
  const tCommon = await getTranslations("common");
  const locale = await getLocale();
  const dateLocale = locale === "bn" ? "bn-BD" : "en-US";
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = (data ?? []).map((r) => ({
    id: r.id,
    name: r.student_name,
    country: r.destination_country ?? "—",
    rating: String(r.rating),
    is_published: String(r.is_published),
    created_at: r.created_at,
  }));

  return (
    <div>
      <PageHeader title={t("title")} description={t("description")}>
        <AdminPageActions href="/admin/testimonials/new" label="New testimonial" />
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
            key: "country",
            title: t("columns.country"),
            dataIndex: "country",
            filters: buildUniqueFilters(rows.map((r) => r.country)),
          },
          {
            key: "rating",
            title: t("columns.rating"),
            dataIndex: "rating",
            sortable: "number",
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
              apiPath: "/api/admin/testimonials",
              editPathTemplate: "/admin/testimonials/{id}/edit",
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
