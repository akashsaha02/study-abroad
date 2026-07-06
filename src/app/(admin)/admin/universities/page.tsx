import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { createClient } from "@/lib/supabase/server";

export default async function AdminUniversitiesPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("universities").select("*, countries(name)").order("name");
  const columns = [
    { key: "name", header: "Name", cell: (r: NonNullable<typeof data>[0]) => r.name },
    {
      key: "country",
      header: "Country",
      cell: (r: NonNullable<typeof data>[0]) =>
        (r.countries as { name?: string })?.name ?? "—",
    },
    {
      key: "published",
      header: "Published",
      cell: (r: NonNullable<typeof data>[0]) => (r.is_published ? "Yes" : "No"),
    },
  ];
  return (
    <div>
      <PageHeader title="Universities" description="Manage university listings." />
      <DataTable columns={columns} data={data ?? []} emptyMessage="No universities" />
    </div>
  );
}
