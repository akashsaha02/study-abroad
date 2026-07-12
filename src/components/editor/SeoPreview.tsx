"use client";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  Clock01Icon,
  Globe02Icon,
  InformationCircleIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface SeoPreviewProps {
  title: string;
  metaDescription: string;
  slug: string;
  wordCount: number;
  baseUrl?: string;
}

const TITLE_MAX = 60;
const DESC_MIN = 120;
const DESC_MAX = 158;
const WORDS_PER_MIN = 200;

function meter(value: number, min: number, max: number) {
  if (value === 0)
    return { label: "Empty", className: "text-muted-foreground", bar: "bg-muted-foreground/40" };
  if (value < min)
    return { label: "A bit short", className: "text-amber-600", bar: "bg-amber-500" };
  if (value > max)
    return { label: "Too long", className: "text-rose-600", bar: "bg-rose-500" };
  return { label: "Looks good", className: "text-emerald-600", bar: "bg-emerald-500" };
}

export function SeoPreview({
  title,
  metaDescription,
  slug,
  wordCount,
  baseUrl = "abroadly.com",
}: SeoPreviewProps) {
  const displayTitle = title.trim() || "Your post title will appear here";
  const displayDesc =
    metaDescription.trim() ||
    "Your meta description gives readers a preview of the post in search results. Aim for 120–158 characters.";
  const cleanSlug = slug.trim() || "your-post-slug";
  const readingTime = Math.max(1, Math.round(wordCount / WORDS_PER_MIN));

  const titleMeter = meter(title.trim().length, 30, TITLE_MAX);
  const descMeter = meter(metaDescription.trim().length, DESC_MIN, DESC_MAX);

  return (
    <div className="space-y-4">
      {/* Google snippet preview */}
      <Card>
        <CardContent className="p-5">
          <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            <HugeiconsIcon icon={Globe02Icon} className="size-3.5" />
            Google preview
          </p>
          <div className="rounded-lg border bg-background p-4">
            <div className="flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-muted text-[10px] font-bold">
                A
              </span>
              <div className="leading-tight">
                <p className="text-xs text-foreground">Abroadly</p>
                <p className="text-xs text-muted-foreground">
                  {baseUrl} › blog › {cleanSlug}
                </p>
              </div>
            </div>
            <h3 className="mt-1.5 line-clamp-1 text-lg font-medium text-[#1a0dab] dark:text-[#8ab4f8]">
              {displayTitle}
            </h3>
            <p className="mt-0.5 line-clamp-2 text-sm text-muted-foreground">
              {displayDesc}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Readability + meters */}
      <Card>
        <CardContent className="space-y-4 p-5">
          <div className="flex items-center justify-between rounded-lg bg-muted/40 p-3">
            <span className="flex items-center gap-2 text-sm font-medium">
              <HugeiconsIcon icon={Clock01Icon} className="size-4 text-primary" />
              Reading time
            </span>
            <span className="text-sm font-semibold">
              {readingTime} min read{" "}
              <span className="font-normal text-muted-foreground">
                · {wordCount} words
              </span>
            </span>
          </div>

          <SeoMeter
            label="Title length"
            value={title.trim().length}
            max={TITLE_MAX}
            meterInfo={titleMeter}
          />
          <SeoMeter
            label="Meta description"
            value={metaDescription.trim().length}
            max={DESC_MAX}
            meterInfo={descMeter}
          />

          <p className="flex items-start gap-2 rounded-lg bg-muted/40 p-3 text-xs text-muted-foreground">
            <HugeiconsIcon
              icon={InformationCircleIcon}
              className="mt-0.5 size-4 shrink-0"
            />
            Keep titles under {TITLE_MAX} characters and descriptions between{" "}
            {DESC_MIN}–{DESC_MAX} so they don&apos;t get truncated in search
            results.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function SeoMeter({
  label,
  value,
  max,
  meterInfo,
}: {
  label: string;
  value: number;
  max: number;
  meterInfo: { label: string; className: string; bar: string };
}) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium">{label}</span>
        <span className={cn("font-medium", meterInfo.className)}>
          {value} chars · {meterInfo.label}
        </span>
      </div>
      <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className={cn("h-full rounded-full transition-all", meterInfo.bar)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
