import { AdminPageActions } from "@/components/admin/AdminPageActions";
import { ResourceRowActions } from "@/components/admin/ResourceRowActions";
import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { createClient } from "@/lib/supabase/server";

export default async function AdminUniversitiesPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("universities")
    .select("*, countries(name)")
    .order("name");

  type Row = NonNullable<typeof data>[0];

  const columns = [
    { key: "name", header: "Name", cell: (r: Row) => r.name },
    {
      key: "country",
      header: "Country",
      cell: (r: Row) => (r.countries as { name?: string })?.name ?? "—",
    },
    {
      key: "actions",
      header: "Actions",
      cell: (r: Row) => (
        <ResourceRowActions
          id={r.id}
          apiPath="/api/admin/universities"
          editHref={`/admin/universities/${r.id}/edit`}
          isPublished={r.is_published}
          itemName={r.name}
        />
      ),
    },
  ];

  return (
    <div>
      <PageHeader title="Universities" description="Manage university listings.">
        <AdminPageActions href="/admin/universities/new" label="New university" />
      </PageHeader>
      <DataTable columns={columns} data={data ?? []} emptyMessage="No universities" />
    </div>
  );
}
