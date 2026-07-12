import { PageHeader } from "@/components/common/PageHeader";
import { FilterableDataTable } from "@/components/tables/FilterableDataTable";
import { APPLICATION_STATUSES } from "@/constants";
import { getUser } from "@/lib/auth/get-user";
import { translateStatus } from "@/lib/i18n-format";
import { buildUniqueFilters } from "@/lib/table-helpers";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";

export default async function CounselorApplicationsPage() {
  const t = await getTranslations("adminPages.applications");
  const tPage = await getTranslations("counselorPages.applications");
  const tStatus = await getTranslations("status");
  const user = await getUser();
  const supabase = await createClient();
  const { data: applications } = await supabase
    .from("applications")
    .select("*, students(profiles(full_name)), universities(name)")
    .eq("counselor_id", user?.id);

  const rows = (applications ?? []).map((app) => ({
    id: app.id,
    student:
      (app.students as { profiles?: { full_name?: string } })?.profiles?.full_name ?? "—",
    university: (app.universities as { name?: string })?.name ?? "—",
    status: app.status,
    statusLabel: translateStatus(tStatus, app.status),
  }));

  return (
    <div>
      <PageHeader title={tPage("title")} description={tPage("description")} />
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
            key: "university",
            title: t("columns.university"),
            dataIndex: "university",
            searchable: true,
            filters: buildUniqueFilters(rows.map((r) => r.university)),
          },
          {
            key: "status",
            title: t("columns.status"),
            dataIndex: "status",
            filters: buildUniqueFilters(APPLICATION_STATUSES, (s) => tStatus(s)),
            cell: { type: "status", labelKey: "statusLabel" },
          },
        ]}
        data={rows}
        emptyText={tPage("empty")}
      />
    </div>
  );
}
