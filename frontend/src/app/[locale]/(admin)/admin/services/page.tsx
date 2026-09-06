import { ServicesAdminPanel } from "@/components/admin/resource-admin-panels";
import { buildPublishedFilters } from "@/lib/table-helpers";
import { createClient } from "@/lib/supabase/server";
import { getLocale, getTranslations } from "next-intl/server";

async function getServices() {
  const supabase = await createClient();
  const { data } = await supabase.from("services").select("*").order("sort_order");
  return data ?? [];
}

export default async function AdminServicesPage() {
  const tCommon = await getTranslations("common");
  const locale = await getLocale();
  const dateLocale = locale === "bn" ? "bn-BD" : "en-US";
  const services = await getServices();

  const rows = services.map((s) => ({
    id: s.id,
    title: s.title,
    slug: s.slug,
    price: String(s.price),
    discount: `${s.discount_percent}%`,
    is_published: String(s.is_published),
    created_at: s.created_at,
  }));

  return (
    <ServicesAdminPanel
      title="Services"
      description="Manage consultancy service pricing and availability."
      addLabel="New service"
      formId="service-form"
      formTitleAdd="New service"
      formTitleEdit="Edit service"
      records={services}
      data={rows}
      emptyText="No services yet."
      modalWidth={720}
      columns={[
        { key: "title", title: "Title", dataIndex: "title", searchable: true, sortable: true },
        { key: "slug", title: "Slug", dataIndex: "slug", searchable: true },
        { key: "price", title: "Price", dataIndex: "price", sortable: "number" },
        { key: "discount", title: "Discount", dataIndex: "discount" },
        {
          key: "published",
          title: "Published",
          dataIndex: "is_published",
          filters: buildPublishedFilters(tCommon),
          cell: { type: "published" },
        },
        {
          key: "created",
          title: "Created",
          dataIndex: "created_at",
          sortable: "date",
          cell: { type: "date", locale: dateLocale },
        },
        {
          key: "actions",
          title: tCommon("actions"),
          cell: {
            type: "resource-actions",
            apiPath: "/api/admin/services",
            publishedKey: "is_published",
            nameKey: "title",
          },
        },
      ]}
    />
  );
}
