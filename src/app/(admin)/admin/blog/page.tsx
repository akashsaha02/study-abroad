import { AdminPageActions } from "@/components/admin/AdminPageActions";
import { ResourceRowActions } from "@/components/admin/ResourceRowActions";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { createClient } from "@/lib/supabase/server";

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  type Row = NonNullable<typeof data>[0];

  const columns = [
    { key: "title", header: "Title", cell: (r: Row) => r.title },
    { key: "slug", header: "Slug", cell: (r: Row) => r.slug },
    {
      key: "actions",
      header: "Actions",
      cell: (r: Row) => (
        <ResourceRowActions
          id={r.id}
          apiPath="/api/admin/blog"
          editHref={`/admin/blog/${r.id}/edit`}
          isPublished={r.is_published}
          itemName={r.title}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Blog" description="Manage blog posts.">
        <AdminPageActions href="/admin/blog/new" label="New post" />
      </PageHeader>
      <DataTable columns={columns} data={data ?? []} emptyMessage="No blog posts" />
    </div>
  );
}
