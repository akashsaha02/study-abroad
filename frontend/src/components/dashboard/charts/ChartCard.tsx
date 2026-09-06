"use client";

import { GlassPanelCard } from "@/components/common/GlassCard";

const CHART_COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function getChartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}

interface ChartCardProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  empty?: boolean;
  emptyText?: string;
}

export function ChartCard({
  title,
  description,
  children,
  empty,
  emptyText = "No data yet",
}: ChartCardProps) {
  return (
    <GlassPanelCard title={title} description={description} variant="glass">
      {empty ? (
        <p className="flex h-[220px] items-center justify-center text-sm text-muted-foreground">
          {emptyText}
        </p>
      ) : (
        <div className="h-[220px] w-full">{children}</div>
      )}
    </GlassPanelCard>
  );
}
