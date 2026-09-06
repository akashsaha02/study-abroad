import { ScholarshipsAdminPanel } from "@/components/admin/resource-admin-panels";
import { buildPublishedFilters } from "@/lib/table-helpers";
import { createClient } from "@/lib/supabase/server";
import { getLocale, getTranslations } from "next-intl/server";

async function getScholarships() {
  const supabase = await createClient();
  const { data } = await supabase.from("scholarships").select("*").order("title");
  return data ?? [];
}

async function getUniversities() {
  const supabase = await createClient();
  const { data } = await supabase.from("universities").select("id, name").order("name");
  return data ?? [];
}

async function getCountries() {
  const supabase = await createClient();
  const { data } = await supabase.from("countries").select("id, name").order("name");
  return data ?? [];
}

export default async function AdminScholarshipsPage() {
  const t = await getTranslations("adminPages.scholarships");
  const tCommon = await getTranslations("common");
  const locale = await getLocale();
  const dateLocale = locale === "bn" ? "bn-BD" : "en-US";
  const [scholarships, universities, countries] = await Promise.all([
    getScholarships(),
    getUniversities(),
    getCountries(),
  ]);

  const rows = scholarships.map((r) => ({
    id: r.id,
    title: r.title,
    amount: r.amount ?? "—",
    deadline: r.deadline ?? "",
    is_published: String(r.is_published),
  }));

  return (
    <ScholarshipsAdminPanel
      universities={universities}
      countries={countries}
      title={t("title")}
      description={t("description")}
      addLabel="New scholarship"
      formId="scholarship-form"
      formTitleAdd="New scholarship"
      formTitleEdit="Edit scholarship"
      records={scholarships}
      data={rows}
      emptyText={t("empty")}
      modalWidth={800}
      columns={[
        {
          key: "title",
          title: t("columns.name"),
          dataIndex: "title",
          searchable: true,
          sortable: true,
        },
        {
          key: "amount",
          title: t("columns.amount"),
          dataIndex: "amount",
          sortable: true,
        },
        {
          key: "deadline",
          title: "Deadline",
          dataIndex: "deadline",
          sortable: "date",
          cell: { type: "date", locale: dateLocale },
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
            apiPath: "/api/admin/scholarships",
            publishedKey: "is_published",
            nameKey: "title",
          },
        },
      ]}
    />
  );
}
