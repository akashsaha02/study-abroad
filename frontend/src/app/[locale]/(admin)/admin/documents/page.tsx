import { PageHeader } from "@/components/common/PageHeader";
import { PageStack } from "@/components/common/PageStack";
import { PanelCard } from "@/components/common/PanelCard";
import { FilterableDataTable } from "@/components/tables/FilterableDataTable";
import { translateStatus } from "@/lib/i18n-format";
import { buildUniqueFilters } from "@/lib/table-helpers";
import { DOCUMENTS_WITH_STUDENT } from "@abroadly/shared/embeds";
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
  const { data: documents, error } = await supabase
    .from("documents")
    .select(DOCUMENTS_WITH_STUDENT)
    .order("uploaded_at", { ascending: false });

  if (error) {
    return (
      <PageStack>
        <PageHeader compact title={t("title")} description={t("description")} />
        <PanelCard className="border-destructive/30 bg-destructive/5">
          <p className="text-sm text-destructive">{t("loadError")}</p>
        </PanelCard>
      </PageStack>
    );
  }

  const rows = (documents ?? []).map((doc) => {
    const student = doc.students as { id?: string; profiles?: { full_name?: string } } | null;
    return {
      id: doc.id,
      student: student?.profiles?.full_name ?? "—",
      detailHref: student?.id ? `/admin/students/${student.id}` : undefined,
      type: doc.document_type,
      file: doc.file_name,
      mime_type: doc.mime_type,
      status: doc.status,
      statusLabel: translateStatus(tStatus, doc.status),
      uploaded_at: doc.uploaded_at,
    };
  });

  return (
    <PageStack>
      <PageHeader
        compact
        title={t("title")}
        description="Review, preview, approve, or reject student documents at any time — including previously approved files."
      />
      <FilterableDataTable
        columns={[
          {
            key: "student",
            title: t("columns.student"),
            dataIndex: "student",
            searchable: true,
            sortable: true,
            cell: { type: "link", hrefKey: "detailHref", labelKey: "student" },
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
            width: 320,
          },
        ]}
        data={rows}
        emptyText={t("empty")}
      />
    </PageStack>
  );
}
