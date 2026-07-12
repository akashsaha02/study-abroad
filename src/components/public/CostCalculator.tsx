"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { PanelCard } from "@/components/common/PanelCard";
import { Button } from "@/components/ui/button";
import { POPULAR_COUNTRIES, ROUTES } from "@/constants";
import type { CostBreakdown } from "@/lib/cost/build-cost-map";
import { selectClassName } from "@/lib/styles";
import { Calculator01Icon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useMemo, useState } from "react";

interface CostCalculatorProps {
  costsByCountry: Record<string, CostBreakdown>;
}

export function CostCalculator({ costsByCountry }: CostCalculatorProps) {
  const countrySlugs = POPULAR_COUNTRIES.map((c) => c.slug);
  const [country, setCountry] = useState<string>(countrySlugs[0] ?? "uk");
  const [duration, setDuration] = useState(3);
  const [livingStyle, setLivingStyle] = useState<"budget" | "standard" | "comfort">("standard");

  const costs = costsByCountry[country] ?? costsByCountry.uk;
  const livingMultiplier =
    livingStyle === "budget" ? 0.8 : livingStyle === "comfort" ? 1.3 : 1;

  const calculation = useMemo(() => {
    const monthlyLiving = costs.living * livingMultiplier;
    const firstYearTuition = costs.tuition;
    const firstYearLiving = monthlyLiving * 12;
    const oneTimeFees = costs.visa + costs.insurance + costs.appFee + 500;
    const firstYearTotal = firstYearTuition + firstYearLiving + oneTimeFees;
    const totalStudyCost =
      costs.tuition * duration + monthlyLiving * 12 * duration + oneTimeFees;

    return {
      firstYearTotal,
      monthlyLiving,
      totalStudyCost,
      suggestedBudget: Math.ceil(firstYearTotal * 1.1),
    };
  }, [costs, duration, livingMultiplier]);

  return (
    <>
      <PageHeader
        eyebrow="Planning tool"
        eyebrowIcon={Calculator01Icon}
        title="Cost calculator"
        description="Estimate your study abroad expenses including tuition, living costs, and fees."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <PanelCard title="Your inputs">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Country</label>
              <select
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                className={`mt-1.5 ${selectClassName}`}
              >
                {POPULAR_COUNTRIES.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">Program duration (years)</label>
              <input
                type="number"
                min={1}
                max={5}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className={`mt-1.5 ${selectClassName}`}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Living style</label>
              <select
                value={livingStyle}
                onChange={(e) =>
                  setLivingStyle(e.target.value as typeof livingStyle)
                }
                className={`mt-1.5 ${selectClassName}`}
              >
                <option value="budget">Budget</option>
                <option value="standard">Standard</option>
                <option value="comfort">Comfort</option>
              </select>
            </div>
          </div>
        </PanelCard>

        <PanelCard title="Cost breakdown">
          <div className="space-y-3">
            <CostRow
              label="First year total"
              value={`$${calculation.firstYearTotal.toLocaleString()}`}
              bold
            />
            <CostRow
              label="Monthly living"
              value={`$${calculation.monthlyLiving.toLocaleString()}`}
            />
            <CostRow
              label={`Total (${duration} years)`}
              value={`$${calculation.totalStudyCost.toLocaleString()}`}
            />
            <CostRow
              label="Suggested minimum budget"
              value={`$${calculation.suggestedBudget.toLocaleString()}`}
              bold
            />
          </div>
          <Button asChild className="mt-6 w-full">
            <Link href={ROUTES.contact}>Talk to a counselor</Link>
          </Button>
        </PanelCard>
      </div>
    </>
  );
}

function CostRow({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div className="flex justify-between border-b border-border/60 pb-3 text-sm last:border-0">
      <span className={bold ? "font-semibold" : "text-muted-foreground"}>{label}</span>
      <span className={bold ? "font-semibold text-primary" : ""}>{value}</span>
    </div>
  );
}
