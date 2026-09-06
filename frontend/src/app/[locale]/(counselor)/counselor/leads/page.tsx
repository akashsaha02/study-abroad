import { PageHeader } from "@/components/common/PageHeader";
import { PageStack } from "@/components/common/PageStack";
import { PanelCard } from "@/components/common/PanelCard";
import { FilterableDataTable } from "@/components/tables/FilterableDataTable";
import { getUser } from "@/lib/auth/get-user";
import {
  getCountryDisplayName,
  resolveCountryNamesForRows,
} from "@/lib/countries/display";
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
  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .eq("assigned_counselor_id", user?.id)
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <PageStack>
        <PageHeader compact title={tPage("title")} description={tPage("description")} />
        <PanelCard className="border-destructive/30 bg-destructive/5">
          <p className="text-sm text-destructive">{tPage("loadError")}</p>
        </PanelCard>
      </PageStack>
    );
  }

  const countryMap = await resolveCountryNamesForRows(supabase, leads ?? []);

  const rows = (leads ?? []).map((lead) => ({
    id: lead.id,
    name: lead.name,
    detailHref: `/admin/leads/${lead.id}`,
    phone: lead.phone,
    country: getCountryDisplayName(lead, countryMap),
    source: lead.source,
    sourceLabel: translateMessageKey(tSource, lead.source),
    status: lead.status,
    statusLabel: translateStatus(tStatus, lead.status),
  }));

  return (
    <PageStack>
      <PageHeader compact title={tPage("title")} description={tPage("description")} />
      <FilterableDataTable
        columns={[
          {
            key: "name",
            title: t("columns.name"),
            dataIndex: "name",
            searchable: true,
            sortable: true,
            cell: { type: "link", hrefKey: "detailHref", labelKey: "name" },
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
    </PageStack>
  );
}
