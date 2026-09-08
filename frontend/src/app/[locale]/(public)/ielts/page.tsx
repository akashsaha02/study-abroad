import { Button } from "antd";
import { IconBadge } from "@/components/common/IconBadge";
import { PageHeader } from "@/components/common/PageHeader";
import { PageLayout } from "@/components/common/PageLayout";
import { SectionHeader } from "@/components/common/SectionHeader";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { BandScoreCalculator } from "@/features/ielts/components/BandScoreCalculator";
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
import { getPublishedIeltsTests, getPublishedQuestionCounts } from "@/features/ielts/queries";
import { getTranslations } from "next-intl/server";
import { getUser } from "@/infrastructure/auth/get-user";

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
  const [counts, tests, user] = await Promise.all([
    getPublishedQuestionCounts(),
    getPublishedIeltsTests(),
    getUser(),
  ]);

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

      <div className="mb-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { href: "/ielts/listening", key: "listening" as const, icon: VolumeHighIcon, tone: "sky" as const },
          { href: "/ielts/reading", key: "reading" as const, icon: BookOpen01Icon, tone: "violet" as const },
          { href: "/ielts/writing", key: "writing" as const, icon: Note01Icon, tone: "success" as const },
          { href: "/ielts/speaking", key: "speaking" as const, icon: FileValidationIcon, tone: "amber" as const },
        ].map((s) => (
          <Link key={s.key} href={s.href}>
            <SurfaceCard hover>
              <IconBadge icon={s.icon} tone={s.tone} />
              <h3 className="mt-4 font-semibold">{t(s.key)}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{t(`${s.key}Desc`)}</p>
            </SurfaceCard>
          </Link>
        ))}
      </div>

      <div className="mb-10 grid gap-4 md:grid-cols-2">
        <SurfaceCard hover={false}>
          <h2 className="text-lg font-semibold">Academic</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            University and professional registration. Academic Reading and Writing Task 1 use charts, graphs, and academic passages.
          </p>
        </SurfaceCard>
        <SurfaceCard hover={false}>
          <h2 className="text-lg font-semibold">General Training</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Migration and work. General Reading uses everyday texts, and Task 1 is a letter. Listening and Speaking are the same for both modules.
          </p>
        </SurfaceCard>
      </div>

      <ol className="mb-10 grid gap-3 sm:grid-cols-5">
        {[
          "Learn the four skills",
          "Practice question types",
          "Take timed tests",
          "Analyse weak areas",
          "Improve your band",
        ].map((step, i) => (
          <li key={step} className="rounded-lg border bg-card p-4 text-sm">
            <span className="text-xs font-semibold text-muted-foreground">0{i + 1}</span>
            <p className="mt-1 font-medium">{step}</p>
          </li>
        ))}
      </ol>

      <SurfaceCard hover={false} className="mb-10">
        <h2 className="text-xl font-semibold">Learn → Practice → Test → Improve</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Published practice items: Listening {counts.listening}, Reading {counts.reading}, Writing {counts.writing}, Speaking {counts.speaking}. {tests.length} published mock tests. Listening and Reading bands are estimated from raw scores. Writing and Speaking stay pending until a reviewer scores them.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link href={user ? ROUTES.dashboardIelts : ROUTES.ieltsPractice}><Button>Practice</Button></Link>
          <Link href={ROUTES.ieltsMockTests}><Button>Mock tests</Button></Link>
          <Link href={ROUTES.ieltsResources}><Button>Resources</Button></Link>
          <Link href={user ? ROUTES.dashboardIelts : "/register"}><Button type="primary">{user ? "Open dashboard" : "Create account"}</Button></Link>
        </div>
      </SurfaceCard>

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
