"use client";

import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { POPULAR_COUNTRIES, ROUTES } from "@/constants";
import Link from "next/link";
import { useMemo, useState } from "react";

const DEFAULT_COSTS: Record<string, { tuition: number; living: number; visa: number; insurance: number; appFee: number }> = {
  uk: { tuition: 18000, living: 1200, visa: 500, insurance: 600, appFee: 100 },
  canada: { tuition: 20000, living: 1000, visa: 200, insurance: 700, appFee: 150 },
  australia: { tuition: 22000, living: 1100, visa: 650, insurance: 500, appFee: 100 },
  usa: { tuition: 25000, living: 1300, visa: 200, insurance: 800, appFee: 100 },
  malaysia: { tuition: 8000, living: 500, visa: 100, insurance: 300, appFee: 50 },
  germany: { tuition: 3000, living: 900, visa: 100, insurance: 400, appFee: 75 },
};

export default function CostCalculatorPage() {
  const [country, setCountry] = useState("uk");
  const [duration, setDuration] = useState(3);
  const [livingStyle, setLivingStyle] = useState<"budget" | "standard" | "comfort">("standard");

  const costs = DEFAULT_COSTS[country] ?? DEFAULT_COSTS.uk;
  const livingMultiplier = livingStyle === "budget" ? 0.8 : livingStyle === "comfort" ? 1.3 : 1;

  const calculation = useMemo(() => {
    const monthlyLiving = costs.living * livingMultiplier;
    const firstYearTuition = costs.tuition;
    const firstYearLiving = monthlyLiving * 12;
    const oneTimeFees = costs.visa + costs.insurance + costs.appFee + 500;
    const firstYearTotal = firstYearTuition + firstYearLiving + oneTimeFees;
    const totalStudyCost = costs.tuition * duration + monthlyLiving * 12 * duration + oneTimeFees;

    return {
      firstYearTotal,
      monthlyLiving,
      totalStudyCost,
      suggestedBudget: Math.ceil(firstYearTotal * 1.1),
    };
  }, [costs, duration, livingMultiplier]);

  return (
    <Container className="py-12">
      <PageHeader
        title="Cost Calculator"
        description="Estimate your study abroad expenses including tuition, living costs, and fees."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardContent className="space-y-4 p-6">
            <div>
              <label className="text-sm font-medium">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              >
                {POPULAR_COUNTRIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Program Duration (years)</label>
              <InputLike
                type="number"
                min={1}
                max={5}
                value={duration}
                onChange={(v) => setDuration(Number(v))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Living Style</label>
              <select
                value={livingStyle}
                onChange={(e) => setLivingStyle(e.target.value as typeof livingStyle)}
                className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
              >
                <option value="budget">Budget</option>
                <option value="standard">Standard</option>
                <option value="comfort">Comfort</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 p-6">
            <h3 className="text-lg font-semibold">Cost Breakdown</h3>
            <div className="space-y-3">
              <Row label="First Year Total" value={`$${calculation.firstYearTotal.toLocaleString()}`} bold />
              <Row label="Monthly Living" value={`$${calculation.monthlyLiving.toLocaleString()}`} />
              <Row label={`Total (${duration} years)`} value={`$${calculation.totalStudyCost.toLocaleString()}`} />
              <Row label="Suggested Minimum Budget" value={`$${calculation.suggestedBudget.toLocaleString()}`} bold />
            </div>
            <Button asChild className="w-full">
              <Link href={ROUTES.contact}>Talk to a Counselor</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex justify-between border-b pb-2 text-sm">
      <span className={bold ? "font-semibold" : "text-muted-foreground"}>{label}</span>
      <span className={bold ? "font-semibold text-primary" : ""}>{value}</span>
    </div>
  );
}

function InputLike({
  type,
  min,
  max,
  value,
  onChange,
}: {
  type: string;
  min?: number;
  max?: number;
  value: number;
  onChange: (v: string) => void;
}) {
  return (
    <input
      type={type}
      min={min}
      max={max}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
    />
  );
}
