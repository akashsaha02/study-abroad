"use client";

import {
  DonutChart,
  HorizontalBarChart,
  LeadsTrendChart,
  StackedStatusChart,
} from "@/components/dashboard/charts";
import type {
  ChartDataPoint,
  TrendDataPoint,
} from "@/features/admin-cms/dashboard";
import { useTranslations } from "next-intl";

interface AdminChartsProps {
  leadsTrend: TrendDataPoint[];
  leadStatus: ChartDataPoint[];
  leadSource: ChartDataPoint[];
  applicationStatus: ChartDataPoint[];
  documentStatus: ChartDataPoint[];
  locale: string;
}

export function AdminCharts({
  leadsTrend,
  leadStatus,
  leadSource,
  applicationStatus,
  documentStatus,
  locale,
}: AdminChartsProps) {
  const tStatus = useTranslations("status");
  const tSource = useTranslations("leadSource");
  const dateLocale = locale === "bn" ? "bn-BD" : "en-US";

  const formatStatus = (name: string) => tStatus(name as never);
  const formatSource = (name: string) => tSource(name as never);

  return (
    <div className="space-y-6">
      <LeadsTrendChart data={leadsTrend} locale={dateLocale} />
      <div className="grid gap-6 lg:grid-cols-2">
        <DonutChart
          data={leadStatus}
          title="Leads by status"
          formatLabel={formatStatus}
        />
        <DonutChart
          data={leadSource}
          title="Leads by source"
          formatLabel={formatSource}
        />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <HorizontalBarChart
          data={applicationStatus}
          title="Application pipeline"
          formatLabel={formatStatus}
        />
        <StackedStatusChart
          data={documentStatus}
          title="Document status"
          formatLabel={formatStatus}
        />
      </div>
    </div>
  );
}
