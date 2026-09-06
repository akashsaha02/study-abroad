import { cn } from "@/lib/utils";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

type IconBadgeTone =
  | "primary"
  | "success"
  | "sky"
  | "violet"
  | "amber"
  | "rose"
  | "neutral";

type IconBadgeSize = "sm" | "md" | "lg";

const TONE_CLASSES: Record<IconBadgeTone, string> = {
  primary: "bg-primary/10 text-primary",
  success:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  sky: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300",
  violet:
    "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-300",
  amber: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  rose: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
  neutral: "bg-muted text-muted-foreground",
};

const SIZE_CLASSES: Record<IconBadgeSize, { box: string; icon: string }> = {
  sm: { box: "size-9 rounded-lg", icon: "size-4" },
  md: { box: "size-11 rounded-xl", icon: "size-5" },
  lg: { box: "size-14 rounded-2xl", icon: "size-6" },
};

interface IconBadgeProps {
  icon: IconSvgElement;
  tone?: IconBadgeTone;
  size?: IconBadgeSize;
  className?: string;
}

/**
 * Consistent icon container used across marketing sections and dashboards.
 * Centralizes tone/size so components stop hardcoding one-off color classes.
 */
export function IconBadge({
  icon,
  tone = "primary",
  size = "md",
  className,
}: IconBadgeProps) {
  const sizing = SIZE_CLASSES[size];
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        sizing.box,
        TONE_CLASSES[tone],
        className
      )}
    >
      <HugeiconsIcon icon={icon} className={sizing.icon} strokeWidth={1.75} />
    </div>
  );
}
