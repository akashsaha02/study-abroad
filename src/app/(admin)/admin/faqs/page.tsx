import { AdminPageActions } from "@/components/admin/AdminPageActions";
import { ResourceRowActions } from "@/components/admin/ResourceRowActions";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { createClient } from "@/lib/supabase/server";

export default async function AdminFaqsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("faqs").select("*").order("sort_order");

  type Row = NonNullable<typeof data>[0];

  const columns = [
    { key: "question", header: "Question", cell: (r: Row) => r.question },
    {
      key: "category",
      header: "Category",
      cell: (r: Row) => r.category ?? "—",
    },
    {
      key: "actions",
      header: "Actions",
      cell: (r: Row) => (
        <ResourceRowActions
          id={r.id}
          apiPath="/api/admin/faqs"
          editHref={`/admin/faqs/${r.id}/edit`}
          isPublished={r.is_published}
          itemName={r.question}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="FAQs" description="Manage frequently asked questions.">
        <AdminPageActions href="/admin/faqs/new" label="New FAQ" />
      </PageHeader>
      <DataTable columns={columns} data={data ?? []} emptyMessage="No FAQs" />
    </div>
  );
}
