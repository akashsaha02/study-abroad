import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { createClient } from "@/lib/supabase/server";

export default async function AdminBlogPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("blog_posts").select("*").order("created_at", { ascending: false });
  const columns = [
    { key: "title", header: "Title", cell: (r: NonNullable<typeof data>[0]) => r.title },
    { key: "slug", header: "Slug", cell: (r: NonNullable<typeof data>[0]) => r.slug },
    {
      key: "published",
      header: "Published",
      cell: (r: NonNullable<typeof data>[0]) => (r.is_published ? "Yes" : "No"),
    },
  ];
  return (
    <div>
      <PageHeader title="Blog" description="Manage blog posts." />
      <DataTable columns={columns} data={data ?? []} emptyMessage="No blog posts" />
    </div>
  );
}
