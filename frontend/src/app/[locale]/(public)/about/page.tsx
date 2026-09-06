import { IconBadge } from "@/components/common/IconBadge";
import { PageHeader } from "@/components/common/PageHeader";
import { PanelCard } from "@/components/common/PanelCard";
import { Section } from "@/components/common/Section";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { buildMetadata } from "@/components/seo/PageSEO";
import {
  Award01Icon,
  CheckmarkCircle02Icon,
  Globe02Icon,
  UserGroupIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("public.about");
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/about",
  });
}

const WHY_KEYS = ["why1", "why2", "why3", "why4", "why5"] as const;

const STATS = [
  { icon: UserGroupIcon, value: "5,000+", key: "statStudents" as const },
  { icon: Globe02Icon, value: "200+", key: "statUniversities" as const },
  { icon: Award01Icon, value: "98%", key: "statVisa" as const },
];

export default async function AboutPage() {
  const t = await getTranslations("public.about");

  return (
    <Section className="bg-mesh">
      <PageHeader
        eyebrow={t("eyebrow")}
        title={t("title")}
        description={t("description")}
      />

      <div className="grid gap-5 sm:grid-cols-3">
        {STATS.map((stat) => (
          <SurfaceCard key={stat.key} hover={false} className="items-center text-center">
            <IconBadge icon={stat.icon} tone="primary" size="lg" />
            <p className="mt-4 text-3xl font-bold">{stat.value}</p>
            <p className="text-sm text-muted-foreground">{t(stat.key)}</p>
          </SurfaceCard>
        ))}
      </div>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <PanelCard title={t("missionTitle")}>
          <p className="text-muted-foreground leading-relaxed">{t("missionP1")}</p>
          <p className="mt-4 text-muted-foreground leading-relaxed">{t("missionP2")}</p>
        </PanelCard>

        <PanelCard title={t("whyTitle")}>
          <ul className="space-y-3">
            {WHY_KEYS.map((key) => (
              <li key={key} className="flex items-start gap-3 text-sm">
                <HugeiconsIcon
                  icon={CheckmarkCircle02Icon}
                  className="mt-0.5 size-5 shrink-0 text-emerald-600 dark:text-emerald-400"
                />
                {t(key)}
              </li>
            ))}
          </ul>
        </PanelCard>
      </div>
    </Section>
  );
}
