import { IconBadge } from "@/components/common/IconBadge";
import { PageHeader } from "@/components/common/PageHeader";
import { PageLayout } from "@/components/common/PageLayout";
import { SectionHeader } from "@/components/common/SectionHeader";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { BandScoreCalculator } from "@/components/ielts/BandScoreCalculator";
import { buildMetadata } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import {
  ArrowRight01Icon,
  BookOpen01Icon,
  FileValidationIcon,
  Note01Icon,
  VolumeHighIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "IELTS Preparation",
  description:
    "Prepare for IELTS with a realistic computer-delivered mock test and an interactive band score calculator.",
  path: "/ielts",
});

const SECTIONS = [
  {
    icon: VolumeHighIcon,
    title: "Listening",
    description: "Audio player with a synchronized answer sheet, exactly like the real exam.",
    tone: "sky" as const,
  },
  {
    icon: BookOpen01Icon,
    title: "Reading",
    description: "Split-screen passage and questions so you never lose your place.",
    tone: "violet" as const,
  },
  {
    icon: Note01Icon,
    title: "Writing",
    description: "Distraction-free editor with a live word counter and task prompt.",
    tone: "success" as const,
  },
];

export default function IeltsPage() {
  return (
    <PageLayout>
      <PageHeader
        eyebrow="Test prep"
        eyebrowIcon={FileValidationIcon}
        title="IELTS preparation"
        description="Practise under real exam conditions and estimate your band score in seconds."
      />

      <SurfaceCard
        hover={false}
        padding="lg"
        className="mb-8 flex flex-col gap-6 bg-linear-to-br from-primary/5 via-card to-emerald-500/10 md:flex-row md:items-center md:justify-between"
      >
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold">Take a full mock test</h2>
          <p className="mt-2 text-muted-foreground">
            A distraction-free interface that mirrors the computer-delivered
            IELTS exam — timed sections, an audio player, and split-screen
            reading and writing.
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {SECTIONS.map((s) => (
              <span
                key={s.title}
                className="inline-flex items-center gap-1.5 rounded-4xl border bg-background px-3 py-1 text-sm"
              >
                <HugeiconsIcon icon={s.icon} className="size-4 text-primary" />
                {s.title}
              </span>
            ))}
          </div>
        </div>
        <Button asChild size="lg" className="shrink-0">
          <Link href="/ielts/mock-test">
            Start mock test
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" data-icon="inline-end" />
          </Link>
        </Button>
      </SurfaceCard>

      <div className="mb-10 grid gap-5 sm:grid-cols-3">
        {SECTIONS.map((s) => (
          <SurfaceCard key={s.title} hover={false}>
            <IconBadge icon={s.icon} tone={s.tone} />
            <h3 className="mt-4 font-semibold">{s.title}</h3>
            <p className="mt-1 text-sm text-muted-foreground">{s.description}</p>
          </SurfaceCard>
        ))}
      </div>

      <SectionHeader
        eyebrow="Calculator"
        title="Band score calculator"
        description="Slide your Reading and Listening correct answers (0–40) and self-assess Writing and Speaking to see your estimated overall band instantly."
        align="left"
      />
      <BandScoreCalculator />
    </PageLayout>
  );
}
