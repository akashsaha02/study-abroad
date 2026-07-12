import { PageHeader } from "@/components/common/PageHeader";
import { FilterableDataTable } from "@/components/tables/FilterableDataTable";
import { buildUniqueFilters } from "@/lib/table-helpers";
import { getUser } from "@/lib/auth/get-user";
import { createClient } from "@/lib/supabase/server";
import { getLocale, getTranslations } from "next-intl/server";

export default async function CounselorNotesPage() {
  const t = await getTranslations("adminPages.notes");
  const locale = await getLocale();
  const dateLocale = locale === "bn" ? "bn-BD" : "en-US";
  const user = await getUser();
  const supabase = await createClient();
  const { data: notes } = await supabase
    .from("notes")
    .select("*")
    .eq("author_id", user?.id)
    .order("created_at", { ascending: false });

  const rows = (notes ?? []).map((note) => ({
    id: note.id,
    content: note.content,
    visibility: note.visibility,
    created_at: note.created_at,
  }));

  return (
    <div>
      <PageHeader title={t("title")} description={t("description")} />
      <FilterableDataTable
        columns={[
          {
            key: "content",
            title: t("columns.content"),
            dataIndex: "content",
            searchable: true,
            cell: { type: "text", clamp: true },
          },
          {
            key: "visibility",
            title: t("columns.visibility"),
            dataIndex: "visibility",
            filters: buildUniqueFilters(rows.map((r) => r.visibility)),
          },
          {
            key: "created",
            title: t("columns.created"),
            dataIndex: "created_at",
            sortable: "date",
            cell: { type: "date", locale: dateLocale },
          },
        ]}
        data={rows}
        emptyText={t("empty")}
      />
    </div>
  );
}
