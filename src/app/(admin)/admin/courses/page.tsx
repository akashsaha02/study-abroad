import { AdminPageActions } from "@/components/admin/AdminPageActions";
import { ResourceRowActions } from "@/components/admin/ResourceRowActions";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { createClient } from "@/lib/supabase/server";

export default async function AdminCoursesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("courses")
    .select("*, universities(name)")
    .order("title");

  type Row = NonNullable<typeof data>[0];

  const columns = [
    { key: "title", header: "Title", cell: (r: Row) => r.title },
    {
      key: "university",
      header: "University",
      cell: (r: Row) => (r.universities as { name?: string })?.name ?? "—",
    },
    {
      key: "level",
      header: "Level",
      cell: (r: Row) => r.degree_level ?? "—",
    },
    {
      key: "actions",
      header: "Actions",
      cell: (r: Row) => (
        <ResourceRowActions
          id={r.id}
          apiPath="/api/admin/courses"
          editHref={`/admin/courses/${r.id}/edit`}
          isPublished={r.is_published}
          itemName={r.title}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Courses" description="Manage course listings.">
        <AdminPageActions href="/admin/courses/new" label="New course" />
      </PageHeader>
      <DataTable columns={columns} data={data ?? []} emptyMessage="No courses" />
    </div>
  );
}
