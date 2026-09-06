import { BlogAdminPanel } from "@/components/admin/resource-admin-panels";
import { buildPublishedFilters } from "@/lib/table-helpers";
import { createClient } from "@/lib/supabase/server";
import { getLocale, getTranslations } from "next-intl/server";

async function getBlogPosts() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function AdminBlogPage() {
  const t = await getTranslations("adminPages.blog");
  const tCommon = await getTranslations("common");
  const locale = await getLocale();
  const dateLocale = locale === "bn" ? "bn-BD" : "en-US";
  const posts = await getBlogPosts();

  const rows = posts.map((r) => ({
    id: r.id,
    title: r.title,
    slug: r.slug,
    is_published: String(r.is_published),
    created_at: r.created_at,
  }));

  return (
    <BlogAdminPanel
      title={t("title")}
      description={t("description")}
      addLabel="New post"
      formId="blog-form"
      formTitleAdd="New post"
      formTitleEdit="Edit post"
      records={posts}
      data={rows}
      emptyText={t("empty")}
      modalWidth={960}
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
            publishedKey: "is_published",
            nameKey: "title",
          },
        },
      ]}
    />
  );
}
