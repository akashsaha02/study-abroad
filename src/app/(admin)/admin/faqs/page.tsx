import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { createClient } from "@/lib/supabase/server";

export default async function AdminFaqsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("faqs").select("*").order("sort_order");
  const columns = [
    { key: "question", header: "Question", cell: (r: NonNullable<typeof data>[0]) => r.question },
    { key: "category", header: "Category", cell: (r: NonNullable<typeof data>[0]) => r.category ?? "—" },
  ];
  return (
    <div>
      <PageHeader title="FAQs" description="Manage frequently asked questions." />
      <DataTable columns={columns} data={data ?? []} emptyMessage="No FAQs" />
    </div>
  );
}
