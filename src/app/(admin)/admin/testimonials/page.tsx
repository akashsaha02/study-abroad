import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { createClient } from "@/lib/supabase/server";

export default async function AdminTestimonialsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("testimonials").select("*").order("created_at", { ascending: false });
  const columns = [
    { key: "name", header: "Student", cell: (r: NonNullable<typeof data>[0]) => r.student_name },
    { key: "country", header: "Country", cell: (r: NonNullable<typeof data>[0]) => r.destination_country ?? "—" },
    { key: "rating", header: "Rating", cell: (r: NonNullable<typeof data>[0]) => r.rating },
  ];
  return (
    <div>
      <PageHeader title="Testimonials" description="Manage student testimonials." />
      <DataTable columns={columns} data={data ?? []} emptyMessage="No testimonials" />
    </div>
  );
}
