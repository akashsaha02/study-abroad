import { AdminPageActions } from "@/components/admin/AdminPageActions";
import { ResourceRowActions } from "@/components/admin/ResourceRowActions";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { createClient } from "@/lib/supabase/server";

export default async function AdminTestimonialsPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("testimonials")
    .select("*")
    .order("created_at", { ascending: false });

  type Row = NonNullable<typeof data>[0];

  const columns = [
    { key: "name", header: "Student", cell: (r: Row) => r.student_name },
    {
      key: "country",
      header: "Country",
      cell: (r: Row) => r.destination_country ?? "—",
    },
    { key: "rating", header: "Rating", cell: (r: Row) => r.rating },
    {
      key: "actions",
      header: "Actions",
      cell: (r: Row) => (
        <ResourceRowActions
          id={r.id}
          apiPath="/api/admin/testimonials"
          editHref={`/admin/testimonials/${r.id}/edit`}
          isPublished={r.is_published}
          itemName={r.student_name}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Testimonials" description="Manage student testimonials.">
        <AdminPageActions href="/admin/testimonials/new" label="New testimonial" />
      </PageHeader>
      <DataTable columns={columns} data={data ?? []} emptyMessage="No testimonials" />
    </div>
  );
}
