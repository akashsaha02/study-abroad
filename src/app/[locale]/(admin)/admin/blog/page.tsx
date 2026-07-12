import { AdminPageActions } from "@/components/admin/AdminPageActions";
import { PageHeader } from "@/components/common/PageHeader";
import { FilterableDataTable } from "@/components/tables/FilterableDataTable";
import { buildPublishedFilters } from "@/lib/table-helpers";
import { createClient } from "@/lib/supabase/server";
import { getLocale, getTranslations } from "next-intl/server";

export default async function AdminBlogPage() {
  const t = await getTranslations("adminPages.blog");
  const tCommon = await getTranslations("common");
  const locale = await getLocale();
  const dateLocale = locale === "bn" ? "bn-BD" : "en-US";
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  const rows = (data ?? []).map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    is_published: String(r.is_published),
    created_at: r.created_at,
  }));

  return (
    <div>
      <PageHeader title={t("title")} description={t("description")}>
        <AdminPageActions href="/admin/blog/new" label="New post" />
      </PageHeader>
      <FilterableDataTable
        columns={[
          {
            key: "title",
            title: t("columns.title"),
            dataIndex: "title",
            searchable: true,
            sortable: true,
          },
          {
            key: "slug",
            title: "Slug",
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
              apiPath: "/api/admin/blog",
              editPathTemplate: "/admin/blog/{id}/edit",
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
