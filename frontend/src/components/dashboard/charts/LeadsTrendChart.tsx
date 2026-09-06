"use client";

import type { TrendDataPoint } from "@/features/admin-cms/dashboard";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ChartCard } from "./ChartCard";

interface LeadsTrendChartProps {
  data: TrendDataPoint[];
  title?: string;
  locale?: string;
}

export function LeadsTrendChart({
  data,
  title = "Lead activity (30 days)",
  locale = "en-US",
}: LeadsTrendChartProps) {
  const hasData = data.some((d) => d.count > 0);
  const formatted = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString(locale, { month: "short", day: "numeric" }),
  }));

  return (
    <ChartCard title={title} empty={!hasData}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={formatted} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
          <defs>
            <linearGradient id="leadGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.35} />
              <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
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
          <Area
            type="monotone"
            dataKey="count"
            stroke="var(--chart-1)"
            fill="url(#leadGradient)"
            strokeWidth={2}
            name="Leads"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
