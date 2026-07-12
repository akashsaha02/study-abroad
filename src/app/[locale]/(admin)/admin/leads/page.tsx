import { PageHeader } from "@/components/common/PageHeader";
import { FilterableDataTable } from "@/components/tables/FilterableDataTable";
import { translateMessageKey, translateStatus } from "@/lib/i18n-format";
import {
  buildLeadSourceFilters,
  buildStatusFilters,
  buildUniqueFilters,
} from "@/lib/table-helpers";
import { getLeads } from "@/lib/services/leads";
import { getLocale, getTranslations } from "next-intl/server";

export default async function AdminLeadsPage() {
  const t = await getTranslations("adminPages.leads");
  const tStatus = await getTranslations("status");
  const tSource = await getTranslations("leadSource");
  const locale = await getLocale();
  const dateLocale = locale === "bn" ? "bn-BD" : "en-US";
  const leads = await getLeads();

  const rows = leads.map((lead) => ({
    id: lead.id,
    name: lead.name,
    detailHref: `/admin/leads/${lead.id}`,
    phone: lead.phone,
    country: lead.preferred_country ?? "—",
    source: lead.source,
    sourceLabel: translateMessageKey(tSource, lead.source),
    status: lead.status,
    statusLabel: translateStatus(tStatus, lead.status),
    created_at: lead.created_at,
  }));

  return (
    <div>
      <PageHeader title={t("title")} description={t("description")} />
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
