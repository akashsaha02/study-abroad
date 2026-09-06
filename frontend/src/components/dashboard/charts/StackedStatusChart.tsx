"use client";

import type { ChartDataPoint } from "@/lib/services/dashboard";
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

interface StackedStatusChartProps {
  data: ChartDataPoint[];
  title: string;
  formatLabel?: (name: string) => string;
}

export function StackedStatusChart({
  data,
  title,
  formatLabel,
}: StackedStatusChartProps) {
  const hasData = data.length > 0 && data.some((d) => d.value > 0);
  const formatted = data.map((d, index) => ({
    status: formatLabel ? formatLabel(d.name) : d.name.replace(/_/g, " "),
    count: d.value,
    fill: getChartColor(index),
  }));

  return (
    <ChartCard title={title} empty={!hasData}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={formatted} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="status"
            tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            interval={0}
            angle={-20}
            textAnchor="end"
            height={50}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "0.75rem",
              fontSize: "0.8125rem",
            }}
          />
          <Bar dataKey="count" name="Count" radius={[4, 4, 0, 0]}>
            {formatted.map((entry, index) => (
              <Cell key={index} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
