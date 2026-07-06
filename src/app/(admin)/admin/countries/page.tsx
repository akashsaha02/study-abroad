import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { createClient } from "@/lib/supabase/server";

async function getContent(table: string) {
  const supabase = await createClient();
  const { data } = await supabase.from(table).select("*").order("created_at", { ascending: false });
  return data ?? [];
}

export default async function AdminCountriesPage() {
  const countries = await getContent("countries");
  const columns = [
    { key: "name", header: "Name", cell: (r: { name: string }) => r.name },
    { key: "slug", header: "Slug", cell: (r: { slug: string }) => r.slug },
    {
      key: "published",
      header: "Published",
      cell: (r: { is_published: boolean }) => (r.is_published ? "Yes" : "No"),
    },
  ];
  return (
    <div>
      <PageHeader title="Countries" description="Manage destination countries." />
      <DataTable columns={columns} data={countries} emptyMessage="No countries" />
    </div>
  );
}
