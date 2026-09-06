"use client";

import type { ChartDataPoint } from "@/features/admin-cms/dashboard";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "./ChartCard";
import { getChartColor } from "./ChartCard";

interface HorizontalBarChartProps {
  data: ChartDataPoint[];
  title: string;
  formatLabel?: (name: string) => string;
}

export function HorizontalBarChart({
  data,
  title,
  formatLabel,
}: HorizontalBarChartProps) {
  const hasData = data.length > 0 && data.some((d) => d.value > 0);
  const formatted = [...data]
    .sort((a, b) => b.value - a.value)
    .slice(0, 8)
    .map((d) => ({
      ...d,
      displayName: formatLabel ? formatLabel(d.name) : d.name.replace(/_/g, " "),
    }));

  return (
    <ChartCard title={title} empty={!hasData}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formatted}
          layout="vertical"
          margin={{ top: 4, right: 8, left: 4, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
          <XAxis type="number" allowDecimals={false} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
          <YAxis
            type="category"
            dataKey="displayName"
            width={110}
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
          />
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "0.75rem",
              fontSize: "0.8125rem",
            }}
          />
          <Bar dataKey="value" radius={[0, 4, 4, 0]}>
            {formatted.map((_, index) => (
              <Cell key={index} fill={getChartColor(index)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
