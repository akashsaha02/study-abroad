import { AdminPageActions } from "@/components/admin/AdminPageActions";
import { PageHeader } from "@/components/common/PageHeader";
import { FilterableDataTable } from "@/components/tables/FilterableDataTable";
import { CONSULTATION_STATUSES } from "@/constants";
import { formatDate, translateStatus } from "@/lib/i18n-format";
import { buildUniqueFilters } from "@/lib/table-helpers";
import { createClient } from "@/lib/supabase/server";
import { Link } from "@/i18n/navigation";
import { getLocale, getTranslations } from "next-intl/server";

export default async function AdminConsultationsPage() {
  const t = await getTranslations("adminPages.consultations");
  const tStatus = await getTranslations("status");
  const tCommon = await getTranslations("common");
  const locale = await getLocale();
  const dateLocale = locale === "bn" ? "bn-BD" : "en-US";
  const supabase = await createClient();
  const { data } = await supabase
    .from("consultations")
    .select(
      "*, leads(name), students(profiles(full_name)), counselors:profiles!consultations_counselor_id_fkey(full_name)"
    )
    .order("created_at", { ascending: false });

  const rows = (data ?? []).map((r) => {
    const leadName = (r.leads as { name?: string })?.name;
    const studentName = (
      r.students as { profiles?: { full_name?: string } }
    )?.profiles?.full_name;
    const scheduledDisplay = r.scheduled_at
      ? formatDate(r.scheduled_at, dateLocale, {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : (r.requested_date ?? "—");

    return {
      id: r.id,
      participant: leadName ?? studentName ?? "—",
      counselor: (r.counselors as { full_name?: string })?.full_name ?? "—",
      scheduled: scheduledDisplay,
      scheduled_at: r.scheduled_at ?? r.requested_date ?? "",
      status: r.status,
      statusLabel: translateStatus(tStatus, r.status),
    };
  });

  return (
    <div>
      <PageHeader title={t("title")} description={t("description")}>
        <AdminPageActions href="/admin/consultations/new" label="Schedule consultation" />
      </PageHeader>
      <FilterableDataTable
        columns={[
          {
            key: "participant",
            title: t("columns.participant"),
            dataIndex: "participant",
            searchable: true,
            sortable: true,
          },
          {
            key: "counselor",
            title: t("columns.counselor"),
            dataIndex: "counselor",
            searchable: true,
            filters: buildUniqueFilters(rows.map((r) => r.counselor)),
          },
          {
            key: "scheduled",
            title: t("columns.scheduled"),
            dataIndex: "scheduled",
            sortKey: "scheduled_at",
            sortable: "date",
          },
          {
            key: "status",
            title: t("columns.status"),
            dataIndex: "status",
            filters: buildUniqueFilters(CONSULTATION_STATUSES, (s) => tStatus(s)),
            cell: { type: "status", labelKey: "statusLabel" },
          },
          {
            key: "actions",
            title: tCommon("actions"),
            cell: { type: "consultation-status" },
          },
        ]}
        data={rows}
        emptyText={t("empty")}
      />
      {rows.length > 0 && (
        <p className="mt-4 text-sm text-muted-foreground">
          <Link href="/admin/consultations/new" className="text-primary hover:underline">
            {t("scheduleNew")}
          </Link>
        </p>
      )}
    </div>
  );
}
