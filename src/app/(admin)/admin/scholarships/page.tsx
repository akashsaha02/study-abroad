import { AdminPageActions } from "@/components/admin/AdminPageActions";
import { ResourceRowActions } from "@/components/admin/ResourceRowActions";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { createClient } from "@/lib/supabase/server";

export default async function AdminScholarshipsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("scholarships").select("*").order("title");

  type Row = NonNullable<typeof data>[0];

  const columns = [
    { key: "title", header: "Title", cell: (r: Row) => r.title },
    {
      key: "amount",
      header: "Amount",
      cell: (r: Row) => r.amount ?? "—",
    },
    {
      key: "deadline",
      header: "Deadline",
      cell: (r: Row) => r.deadline ?? "—",
    },
    {
      key: "actions",
      header: "Actions",
      cell: (r: Row) => (
        <ResourceRowActions
          id={r.id}
          apiPath="/api/admin/scholarships"
          editHref={`/admin/scholarships/${r.id}/edit`}
          isPublished={r.is_published}
          itemName={r.title}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Scholarships" description="Manage scholarship listings.">
        <AdminPageActions href="/admin/scholarships/new" label="New scholarship" />
      </PageHeader>
      <DataTable columns={columns} data={data ?? []} emptyMessage="No scholarships" />
    </div>
  );
}
