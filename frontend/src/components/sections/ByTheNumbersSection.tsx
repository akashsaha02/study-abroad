"use client";

import { Container } from "@/components/common/Container";
import { GlassStatCard } from "@/components/common/GlassCard";
import { AnimatedCounter } from "@/components/common/AnimatedCounter";
import { SectionHeader } from "@/components/common/SectionHeader";
import {
  Globe02Icon,
  GraduationScrollIcon,
  StarIcon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { useTranslations } from "next-intl";

const STATS = [
  { labelKey: "studentsLabel" as const, value: 5000, suffix: "+", icon: UserGroupIcon, tone: "primary" as const },
  { labelKey: "universitiesLabel" as const, value: 120, suffix: "+", icon: GraduationScrollIcon, tone: "violet" as const },
  { labelKey: "countriesLabel" as const, value: 15, suffix: "+", icon: Globe02Icon, tone: "sky" as const },
  { labelKey: "successLabel" as const, value: 94, suffix: "%", icon: StarIcon, tone: "success" as const },
];

export function ByTheNumbersSection() {
  const t = useTranslations("home.stats");

  return (
    <section className="py-16 md:py-24">
      <Container>
        <SectionHeader
          eyebrow={t("eyebrow")}
          eyebrowIcon={StarIcon}
          title={t("title")}
          description={t("description")}
        />
        <div className="stagger-children grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STATS.map((stat) => (
            <GlassStatCard
              key={stat.labelKey}
              label={t(stat.labelKey)}
              value={
                <AnimatedCounter
                  value={stat.value}
                  suffix={stat.suffix}
                  className="text-3xl font-bold tracking-tight"
                />
              }
              icon={stat.icon}
              tone={stat.tone}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
