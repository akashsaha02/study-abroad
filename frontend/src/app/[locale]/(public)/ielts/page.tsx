import { Button } from "antd";
import { IconBadge } from "@/components/common/IconBadge";
import { PageHeader } from "@/components/common/PageHeader";
import { PageLayout } from "@/components/common/PageLayout";
import { SectionHeader } from "@/components/common/SectionHeader";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { BandScoreCalculator } from "@/components/ielts/BandScoreCalculator";
import { buildMetadata } from "@/components/seo/PageSEO";
import { ROUTES } from "@/constants";
import { Link } from "@/i18n/navigation";
import {
  ArrowRight01Icon,
  BookOpen01Icon,
  FileValidationIcon,
  Note01Icon,
  VolumeHighIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("public.ielts");
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/ielts",
  });
}

const SECTION_KEYS = [
  { icon: VolumeHighIcon, key: "listening", tone: "sky" as const },
  { icon: BookOpen01Icon, key: "reading", tone: "violet" as const },
  { icon: Note01Icon, key: "writing", tone: "success" as const },
] as const;

export default async function IeltsPage() {
  const t = await getTranslations("public.ielts");

  return (
    <PageLayout>
      <PageHeader
        eyebrow={t("eyebrow")}
        eyebrowIcon={FileValidationIcon}
        title={t("title")}
        description={t("description")}
      />

      <SurfaceCard
        hover={false}
        padding="lg"
        className="mb-8 flex flex-col gap-6 bg-linear-to-br from-primary/5 via-card to-emerald-500/10 md:flex-row md:items-center md:justify-between"
      >
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold">{t("mockTitle")}</h2>
          <p className="mt-2 text-muted-foreground">{t("mockDesc")}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SECTION_KEYS.map((s) => (
              <span
                key={s.key}
                className="inline-flex items-center gap-1.5 rounded-4xl border bg-background px-3 py-1 text-sm"
              >
                <HugeiconsIcon icon={s.icon} className="size-4 text-primary" />
                {t(s.key)}
              </span>
            ))}
          </div>
        </div>
        <Link href={ROUTES.ieltsMockTest}>
          <Button size="large" className="shrink-0">
            {t("mockCta")}
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" data-icon="inline-end" />
          </Button>
        </Link>
      </SurfaceCard>

      <div className="mb-10 grid gap-5 sm:grid-cols-3">
        {SECTION_KEYS.map((s) => (
          <SurfaceCard key={s.key} hover={false}>
            <IconBadge icon={s.icon} tone={s.tone} />
            <h3 className="mt-4 font-semibold">{t(s.key)}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{t(`${s.key}Desc`)}</p>
          </SurfaceCard>
        ))}
      </div>

      <SectionHeader
        eyebrow={t("eyebrow")}
        title={t("calculatorTitle")}
        description={t("calculatorDesc")}
        align="left"
      />
      <BandScoreCalculator />
    </PageLayout>
  );
}
