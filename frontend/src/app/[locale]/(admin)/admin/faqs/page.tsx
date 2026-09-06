import { FaqsAdminPanel } from "@/components/admin/resource-admin-panels";
import { buildPublishedFilters, buildUniqueFilters } from "@/lib/table-helpers";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";

async function getFaqs() {
  const supabase = await createClient();
  const { data } = await supabase.from("faqs").select("*").order("sort_order");
  return data ?? [];
}

async function getCountries() {
  const supabase = await createClient();
  const { data } = await supabase.from("countries").select("id, name").order("name");
  return data ?? [];
}

export default async function AdminFaqsPage() {
  const t = await getTranslations("adminPages.faqs");
  const tCommon = await getTranslations("common");
  const [faqs, countries] = await Promise.all([getFaqs(), getCountries()]);

  const rows = faqs.map((r) => ({
    id: r.id,
    question: r.question,
    category: r.category ?? "—",
    is_published: String(r.is_published),
  }));

  return (
    <FaqsAdminPanel
      countries={countries}
      title={t("title")}
      description={t("description")}
      addLabel="New FAQ"
      formId="faq-form"
      formTitleAdd="New FAQ"
      formTitleEdit="Edit FAQ"
      records={faqs}
      data={rows}
      emptyText={t("empty")}
      modalWidth={720}
      columns={[
        {
          key: "question",
          title: t("columns.question"),
          dataIndex: "question",
          searchable: true,
          sortable: true,
        },
        {
          key: "category",
          title: t("columns.category"),
          dataIndex: "category",
          filters: buildUniqueFilters(rows.map((r) => r.category)),
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
            apiPath: "/api/admin/faqs",
            publishedKey: "is_published",
            nameKey: "question",
          },
        },
      ]}
    />
  );
}
