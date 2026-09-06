"use client";

import { AppSelect } from "@/components/common/AppSelect";
import { Button, InputNumber } from "antd";
import { PageHeader } from "@/components/common/PageHeader";
import { PanelCard } from "@/components/common/PanelCard";
import { POPULAR_COUNTRIES, ROUTES } from "@/constants";
import { buildLeadContextUrl } from "@/features/leads/urls";
import type { CostBreakdown } from "@/lib/cost/build-cost-map";
import { Calculator01Icon } from "@hugeicons/core-free-icons";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";

interface CostCalculatorProps {
  costsByCountry: Record<string, CostBreakdown>;
}

export function CostCalculator({ costsByCountry }: CostCalculatorProps) {
  const t = useTranslations("public.costCalculator");
  const countrySlugs = POPULAR_COUNTRIES.map((c) => c.slug);
  const [country, setCountry] = useState<string>(countrySlugs[0] ?? "uk");
  const [duration, setDuration] = useState(3);
  const [livingStyle, setLivingStyle] = useState<"budget" | "standard" | "comfort">("standard");

  const livingStyleOptions = [
    { value: "budget", label: t("budget") },
    { value: "standard", label: t("standard") },
    { value: "comfort", label: t("comfort") },
  ];

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
        eyebrow={t("eyebrow")}
        eyebrowIcon={Calculator01Icon}
        title={t("title")}
        description={t("description")}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <PanelCard title={t("inputs")}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">{t("country")}</label>
              <AppSelect
                className="mt-1.5"
                value={country}
                onChange={setCountry}
                allowClear={false}
                showSearch
                options={POPULAR_COUNTRIES.map((c) => ({
                  value: c.slug,
                  label: c.name,
                }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t("duration")}</label>
              <InputNumber
                className="mt-1.5 w-full!"
                min={1}
                max={5}
                value={duration}
                onChange={(value) => setDuration(value ?? 1)}
                size="large"
              />
            </div>
            <div>
              <label className="text-sm font-medium">{t("livingStyle")}</label>
              <AppSelect
                className="mt-1.5"
                value={livingStyle}
                onChange={(value) =>
                  setLivingStyle(value as typeof livingStyle)
                }
                allowClear={false}
                options={livingStyleOptions}
              />
            </div>
          </div>
        </PanelCard>

        <PanelCard title={t("breakdown")}>
          <div className="space-y-3">
            <CostRow
              label={t("firstYear")}
              value={`$${calculation.firstYearTotal.toLocaleString()}`}
              bold
            />
            <CostRow
              label={t("monthlyLiving")}
              value={`$${calculation.monthlyLiving.toLocaleString()}`}
            />
            <CostRow
              label={t("totalYears", { years: duration })}
              value={`$${calculation.totalStudyCost.toLocaleString()}`}
            />
            <CostRow
              label={t("suggestedBudget")}
              value={`$${calculation.suggestedBudget.toLocaleString()}`}
              bold
            />
          </div>
          <Link href={buildLeadContextUrl(ROUTES.bookConsultation, { country })}>
            <Button className="mt-6 w-full" size="large" type="primary">
              {t("talkCounselor")}
            </Button>
          </Link>
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
