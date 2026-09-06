import { PageHeader } from "@/components/common/PageHeader";
import { PageStack } from "@/components/common/PageStack";
import { FilterableDataTable } from "@/components/tables/FilterableDataTable";
import { APPLICATION_STATUSES } from "@/constants";
import { translateStatus } from "@/lib/i18n-format";
import { buildUniqueFilters } from "@/lib/table-helpers";
import { APPLICATIONS_WITH_STUDENT } from "@abroadly/shared/embeds";
import { createClient } from "@/lib/supabase/server";
import { getLocale, getTranslations } from "next-intl/server";

export default async function AdminApplicationsPage() {
  const t = await getTranslations("adminPages.applications");
  const tStatus = await getTranslations("status");
  const locale = await getLocale();
  const dateLocale = locale === "bn" ? "bn-BD" : "en-US";
  const supabase = await createClient();
  const { data: applications } = await supabase
    .from("applications")
    .select(APPLICATIONS_WITH_STUDENT)
    .order("created_at", { ascending: false });

  const rows = (applications ?? []).map((app) => ({
    id: app.id,
    student:
      (app.students as { profiles?: { full_name?: string } })?.profiles?.full_name ?? "—",
    detailHref: `/admin/applications/${app.id}`,
    university: (app.universities as { name?: string })?.name ?? "—",
    country: (app.countries as { name?: string })?.name ?? "—",
    status: app.status,
    statusLabel: translateStatus(tStatus, app.status),
    created_at: app.created_at,
  }));

  return (
    <PageStack>
      <PageHeader compact title={t("title")} description={t("description")} />
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
            key: "university",
            title: t("columns.university"),
            dataIndex: "university",
            searchable: true,
            filters: buildUniqueFilters(rows.map((r) => r.university)),
          },
          {
            key: "country",
            title: t("columns.country"),
            dataIndex: "country",
            filters: buildUniqueFilters(rows.map((r) => r.country)),
          },
          {
            key: "status",
            title: t("columns.status"),
            dataIndex: "status",
            filters: buildUniqueFilters(APPLICATION_STATUSES, (s) => tStatus(s)),
            cell: { type: "status", labelKey: "statusLabel" },
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
    </PageStack>
  );
}
