import { SurfaceCard } from "@/components/common/SurfaceCard";
import { cn } from "@/lib/utils";
import { Button, Tag } from "antd";import { matchTier, type Program } from "@/data/programs";
import {
  ArrowRight01Icon,
  Calendar01Icon,
  Clock01Icon,
  Globe02Icon,
  StarIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface ProgramCardProps {
  program: Program;
  matchScore: number;
}

function formatTuition(usd: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(usd);
}

export function ProgramCard({ program, matchScore }: ProgramCardProps) {
  const tier = matchTier(matchScore);

  return (
    <SurfaceCard className="group h-full">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex size-12 shrink-0 items-center justify-center rounded-xl border bg-muted/50 text-sm font-bold text-primary">
            {program.universityShort}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-muted-foreground">
              {program.university}
            </p>
            <p className="flex items-center gap-1 text-xs text-muted-foreground">
              <span aria-hidden>{program.countryFlag}</span>
              {program.city}, {program.country}
            </p>
          </div>
        </div>
        <Tag
          className={cn("shrink-0 gap-1 font-semibold", tier.className)}
          title={tier.label}
        >
          {matchScore}% match
        </Tag>
      </div>

      <div>
        <h3 className="mt-4 text-base font-semibold leading-snug text-foreground">
          {program.name}
        </h3>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <Tag>{program.degreeLevel}</Tag>
          <Tag>{program.subjectArea}</Tag>
          {program.ranking && (
            <Tag className="gap-1">
              <HugeiconsIcon icon={StarIcon} className="size-3" />#{program.ranking} world
            </Tag>
          )}
        </div>
      </div>

      <dl className="mt-auto grid grid-cols-2 gap-3 border-t pt-4 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">Tuition / year</dt>
          <dd className="font-semibold text-foreground">
            {formatTuition(program.tuitionUsd)}
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1 text-xs text-muted-foreground">
            <HugeiconsIcon icon={Clock01Icon} className="size-3.5" />
            Duration
          </dt>
          <dd className="font-semibold text-foreground">
            {program.durationMonths} months
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1 text-xs text-muted-foreground">
            <HugeiconsIcon icon={Globe02Icon} className="size-3.5" />
            Min. IELTS
          </dt>
          <dd className="font-semibold text-foreground">
            {program.ieltsRequired.toFixed(1)}
          </dd>
        </div>
        <div>
          <dt className="flex items-center gap-1 text-xs text-muted-foreground">
            <HugeiconsIcon icon={Calendar01Icon} className="size-3.5" />
            Intakes
          </dt>
          <dd className="font-semibold text-foreground">
            {program.intakes.join(", ")}
          </dd>
        </div>
      </dl>

      <Button
        size="small"
        className="mt-4 w-full justify-center transition-colors group-hover:border-primary/40 group-hover:text-primary"
      >
        View program
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          className="size-4 transition-transform group-hover:translate-x-0.5"
          data-icon="inline-end"
        />
      </Button>
    </SurfaceCard>
  );
}
