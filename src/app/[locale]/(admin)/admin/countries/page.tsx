import { CountriesAdminPanel } from "@/components/admin/resource-admin-panels";
import { buildPublishedFilters } from "@/lib/table-helpers";
import { createClient } from "@/lib/supabase/server";
import { getLocale, getTranslations } from "next-intl/server";

async function getCountries() {
  const supabase = await createClient();
  const { data } = await supabase
    .from("countries")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function AdminCountriesPage() {
  const t = await getTranslations("adminPages.countries");
  const tCommon = await getTranslations("common");
  const locale = await getLocale();
  const dateLocale = locale === "bn" ? "bn-BD" : "en-US";
  const countries = await getCountries();

  const rows = countries.map((r) => ({
    id: r.id,
    name: r.name,
    slug: r.slug,
    is_published: String(r.is_published),
    created_at: r.created_at,
  }));

  return (
    <CountriesAdminPanel
      title={t("title")}
      description={t("description")}
      addLabel="New country"
      formId="country-form"
      formTitleAdd="New country"
      formTitleEdit="Edit country"
      records={countries}
      data={rows}
      emptyText={t("empty")}
      modalWidth={800}
      columns={[
        {
          key: "name",
          title: t("columns.name"),
          dataIndex: "name",
          searchable: true,
          sortable: true,
        },
        {
          key: "slug",
          title: t("columns.slug"),
          dataIndex: "slug",
          searchable: true,
        },
        {
          key: "published",
          title: t("columns.published"),
          dataIndex: "is_published",
          filters: buildPublishedFilters(tCommon),
          cell: { type: "published" },
        },
        {
          key: "created",
          title: t("columns.created"),
          dataIndex: "created_at",
          sortable: "date",
          cell: { type: "date", locale: dateLocale },
        },
        {
          key: "actions",
          title: tCommon("actions"),
          cell: {
            type: "resource-actions",
            apiPath: "/api/admin/countries",
            publishedKey: "is_published",
            nameKey: "name",
          },
        },
      ]}
    />
  );
}
