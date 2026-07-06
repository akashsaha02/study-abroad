import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { createClient } from "@/lib/supabase/server";

export default async function AdminScholarshipsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("scholarships").select("*").order("title");
  const columns = [
    { key: "title", header: "Title", cell: (r: NonNullable<typeof data>[0]) => r.title },
    { key: "amount", header: "Amount", cell: (r: NonNullable<typeof data>[0]) => r.amount ?? "—" },
    { key: "deadline", header: "Deadline", cell: (r: NonNullable<typeof data>[0]) => r.deadline ?? "—" },
  ];
  return (
    <div>
      <PageHeader title="Scholarships" description="Manage scholarship listings." />
      <DataTable columns={columns} data={data ?? []} emptyMessage="No scholarships" />
    </div>
  );
}
