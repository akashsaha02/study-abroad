import { PageHeader } from "@/components/common/PageHeader";
import { DataTable } from "@/components/tables/DataTable";
import { createClient } from "@/lib/supabase/server";

export default async function AdminSettingsPage() {
  const supabase = await createClient();
  const { data } = await supabase.from("cost_settings").select("*").order("country");
  const columns = [
    { key: "country", header: "Country", cell: (r: NonNullable<typeof data>[0]) => r.country },
    { key: "level", header: "Degree", cell: (r: NonNullable<typeof data>[0]) => r.degree_level },
    {
      key: "tuition",
      header: "Tuition Range",
      cell: (r: NonNullable<typeof data>[0]) =>
        `$${r.tuition_min?.toLocaleString()} – $${r.tuition_max?.toLocaleString()}`,
    },
  ];
  return (
    <div>
      <PageHeader title="Settings" description="Cost calculator and platform settings." />
      <DataTable columns={columns} data={data ?? []} emptyMessage="No cost settings configured" />
    </div>
  );
}
