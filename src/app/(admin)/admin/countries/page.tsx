import { AdminPageActions } from "@/components/admin/AdminPageActions";
import { ResourceRowActions } from "@/components/admin/ResourceRowActions";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { createClient } from "@/lib/supabase/server";

async function getContent(table: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from(table)
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function AdminCountriesPage() {
  const countries = await getContent("countries");

  type Row = (typeof countries)[0];

  const columns = [
    { key: "name", header: "Name", cell: (r: Row) => r.name },
    { key: "slug", header: "Slug", cell: (r: Row) => r.slug },
    {
      key: "actions",
      header: "Actions",
      cell: (r: Row) => (
        <ResourceRowActions
          id={r.id}
          apiPath="/api/admin/countries"
          editHref={`/admin/countries/${r.id}/edit`}
          isPublished={r.is_published}
          itemName={r.name}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Countries" description="Manage destination countries.">
        <AdminPageActions href="/admin/countries/new" label="New country" />
      </PageHeader>
      <DataTable columns={columns} data={countries} emptyMessage="No countries" />
    </div>
  );
}
