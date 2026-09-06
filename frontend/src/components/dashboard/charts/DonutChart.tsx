"use client";

import type { ChartDataPoint } from "@/lib/services/dashboard";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartCard } from "./ChartCard";
import { getChartColor } from "./ChartCard";

interface DonutChartProps {
  data: ChartDataPoint[];
  title: string;
  formatLabel?: (name: string) => string;
}

export function DonutChart({ data, title, formatLabel }: DonutChartProps) {
  const hasData = data.length > 0 && data.some((d) => d.value > 0);
  const formatted = data.map((d) => ({
    ...d,
    displayName: formatLabel ? formatLabel(d.name) : d.name,
  }));

  return (
    <ChartCard title={title} empty={!hasData}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={formatted}
            dataKey="value"
            nameKey="displayName"
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={2}
          >
            {formatted.map((_, index) => (
              <Cell key={index} fill={getChartColor(index)} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: "0.75rem",
              fontSize: "0.8125rem",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
