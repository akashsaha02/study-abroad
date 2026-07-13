import { PageHeader } from "@/components/common/PageHeader";
import { FilterableDataTable } from "@/components/tables/FilterableDataTable";
import { createClient } from "@/lib/supabase/server";
import { getLocale } from "next-intl/server";

async function getServiceOrders() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("service_orders")
    .select("*, services(title, slug)")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function AdminServiceOrdersPage() {
  const locale = await getLocale();
  const dateLocale = locale === "bn" ? "bn-BD" : "en-US";
  const orders = await getServiceOrders();

  const rows = orders.map((o) => ({
    id: o.id,
    service: (o.services as { title?: string } | null)?.title ?? "—",
    quantity: String(o.quantity),
    unit_price: `৳${Number(o.unit_price).toLocaleString()}`,
    status: o.status,
    created_at: o.created_at,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Service orders"
        description="Order requests submitted from the public services catalog."
      />
      <FilterableDataTable
        data={rows}
        emptyText="No service orders yet."
        columns={[
          { key: "service", title: "Service", dataIndex: "service", searchable: true },
          { key: "quantity", title: "Qty", dataIndex: "quantity" },
          { key: "unit_price", title: "Unit price", dataIndex: "unit_price" },
          { key: "status", title: "Status", dataIndex: "status", sortable: true },
          {
            key: "created",
            title: "Created",
            dataIndex: "created_at",
            sortable: "date",
            cell: { type: "date", locale: dateLocale },
          },
        ]}
      />
    </div>
  );
}
