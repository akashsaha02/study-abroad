import { UniversitiesAdminPanel } from "@/components/admin/resource-admin-panels";
import { buildPublishedFilters, buildUniqueFilters } from "@/lib/table-helpers";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";

async function getUniversities() {
  const supabase = await createClient();
  const { data } = await supabase.from("universities").select("*").order("name");
  return data ?? [];
}

async function getCountries() {
  const supabase = await createClient();
  const { data } = await supabase.from("countries").select("id, name").order("name");
  return data ?? [];
}

export default async function AdminUniversitiesPage() {
  const t = await getTranslations("adminPages.universities");
  const tCommon = await getTranslations("common");
  const [universities, countries] = await Promise.all([getUniversities(), getCountries()]);
  const countryMap = new Map(countries.map((c) => [c.id, c.name]));

  const rows = universities.map((r) => ({
    id: r.id,
    name: r.name,
    country: countryMap.get(r.country_id) ?? "—",
    is_published: String(r.is_published),
  }));

  return (
    <UniversitiesAdminPanel
      countries={countries}
      title={t("title")}
      description={t("description")}
      addLabel="New university"
      formId="university-form"
      formTitleAdd="New university"
      formTitleEdit="Edit university"
      records={universities}
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
          key: "country",
          title: t("columns.country"),
          dataIndex: "country",
          filters: buildUniqueFilters(rows.map((r) => r.country)),
        },
        {
          key: "published",
          title: t("columns.published"),
          dataIndex: "is_published",
          filters: buildPublishedFilters(tCommon),
          cell: { type: "published" },
        },
        {
          key: "actions",
          title: tCommon("actions"),
          cell: {
            type: "resource-actions",
            apiPath: "/api/admin/universities",
            publishedKey: "is_published",
            nameKey: "name",
          },
        },
      ]}
    />
  );
}
