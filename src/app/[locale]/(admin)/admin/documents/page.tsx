import { PageHeader } from "@/components/common/PageHeader";
import { FilterableDataTable } from "@/components/tables/FilterableDataTable";
import { translateStatus } from "@/lib/i18n-format";
import { buildUniqueFilters } from "@/lib/table-helpers";
import { createClient } from "@/lib/supabase/server";
import { getLocale, getTranslations } from "next-intl/server";

const DOCUMENT_STATUSES = [
  "pending_review",
  "approved",
  "rejected",
  "needs_update",
] as const;

export default async function AdminDocumentsPage() {
  const t = await getTranslations("adminPages.documents");
  const tStatus = await getTranslations("status");
  const tCommon = await getTranslations("common");
  const locale = await getLocale();
  const dateLocale = locale === "bn" ? "bn-BD" : "en-US";
  const supabase = await createClient();
  const { data: documents } = await supabase
    .from("documents")
    .select("*, students(profiles(full_name))")
    .eq("status", "pending_review")
    .order("uploaded_at", { ascending: false });

  const rows = (documents ?? []).map((doc) => ({
    id: doc.id,
    student:
      (doc.students as { profiles?: { full_name?: string } })?.profiles?.full_name ?? "—",
    type: doc.document_type,
    file: doc.file_name,
    status: doc.status,
    statusLabel: translateStatus(tStatus, doc.status),
    uploaded_at: doc.uploaded_at,
  }));

  return (
    <div>
      <PageHeader title={t("title")} description={t("description")} />
      <FilterableDataTable
        columns={[
          {
            key: "student",
            title: t("columns.student"),
            dataIndex: "student",
            searchable: true,
            sortable: true,
          },
          {
            key: "type",
            title: t("columns.type"),
            dataIndex: "type",
            filters: buildUniqueFilters(rows.map((r) => r.type)),
          },
          {
            key: "file",
            title: t("columns.file"),
            dataIndex: "file",
            searchable: true,
          },
          {
            key: "status",
            title: t("columns.status"),
            dataIndex: "status",
            filters: buildUniqueFilters(DOCUMENT_STATUSES, (s) => tStatus(s)),
            cell: { type: "status", labelKey: "statusLabel" },
          },
          {
            key: "uploaded",
            title: t("columns.uploaded"),
            dataIndex: "uploaded_at",
            sortable: "date",
            cell: { type: "date", locale: dateLocale },
          },
          {
            key: "actions",
            title: tCommon("actions"),
            cell: { type: "document-review" },
          },
        ]}
        data={rows}
        emptyText={t("empty")}
      />
    </div>
  );
}
