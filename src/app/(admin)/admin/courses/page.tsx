import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { createClient } from "@/lib/supabase/server";

export default async function AdminCoursesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("courses").select("*, universities(name)").order("title");
  const columns = [
    { key: "title", header: "Title", cell: (r: NonNullable<typeof data>[0]) => r.title },
    {
      key: "university",
      header: "University",
      cell: (r: NonNullable<typeof data>[0]) =>
        (r.universities as { name?: string })?.name ?? "—",
    },
    { key: "level", header: "Level", cell: (r: NonNullable<typeof data>[0]) => r.degree_level ?? "—" },
  ];
  return (
    <div>
      <PageHeader title="Courses" description="Manage course listings." />
      <DataTable columns={columns} data={data ?? []} emptyMessage="No courses" />
    </div>
  );
}
