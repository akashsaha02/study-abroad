import { PageHeader } from "@/components/common/PageHeader";
import { FilterableDataTable } from "@/components/tables/FilterableDataTable";
import { getUser } from "@/lib/auth/get-user";
import { translateMessageKey, translateStatus } from "@/lib/i18n-format";
import { buildLeadSourceFilters, buildStatusFilters, buildUniqueFilters } from "@/lib/table-helpers";
import { createClient } from "@/lib/supabase/server";
import { getTranslations } from "next-intl/server";

export default async function CounselorLeadsPage() {
  const t = await getTranslations("adminPages.leads");
  const tPage = await getTranslations("counselorPages.leads");
  const tStatus = await getTranslations("status");
  const tSource = await getTranslations("leadSource");
  const user = await getUser();
  const supabase = await createClient();
  const { data: leads } = await supabase
    .from("leads")
    .select("*")
    .eq("assigned_counselor_id", user?.id)
    .order("created_at", { ascending: false });

  const rows = (leads ?? []).map((lead) => ({
    id: lead.id,
    name: lead.name,
    phone: lead.phone,
    country: lead.preferred_country ?? "—",
    source: lead.source,
    sourceLabel: translateMessageKey(tSource, lead.source),
    status: lead.status,
    statusLabel: translateStatus(tStatus, lead.status),
  }));

  return (
    <div>
      <PageHeader title={tPage("title")} description={tPage("description")} />
      <FilterableDataTable
        columns={[
          {
            key: "name",
            title: t("columns.name"),
            dataIndex: "name",
            searchable: true,
            sortable: true,
          },
          {
            key: "phone",
            title: t("columns.phone"),
            dataIndex: "phone",
            searchable: true,
          },
          {
            key: "country",
            title: t("columns.country"),
            dataIndex: "country",
            filters: buildUniqueFilters(rows.map((r) => r.country)),
          },
          {
            key: "source",
            title: t("columns.source"),
            dataIndex: "source",
            filters: buildLeadSourceFilters(tSource),
            cell: { type: "text", displayKey: "sourceLabel" },
          },
          {
            key: "status",
            title: t("columns.status"),
            dataIndex: "status",
            filters: buildStatusFilters(tStatus),
            cell: { type: "status", labelKey: "statusLabel" },
          },
        ]}
        data={rows}
        emptyText={tPage("empty")}
      />
    </div>
  );
}
