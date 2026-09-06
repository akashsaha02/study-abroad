import { cn } from "@/lib/utils";
import type { IconSvgElement } from "@hugeicons/react";
import { Eyebrow } from "./Eyebrow";

interface SectionHeaderProps {
  eyebrow?: string;
  eyebrowIcon?: IconSvgElement;
  title: string;
  description?: string;
  align?: "center" | "left";
  className?: string;
  /** Optional action rendered to the right when align="left". */
  action?: React.ReactNode;
}

/**
 * Unified heading block for marketing sections: optional eyebrow label,
 * a title, and a supporting description. Replaces the repeated
 * `mb-10 text-center` heading markup scattered across sections.
 */
export function SectionHeader({
  eyebrow,
  eyebrowIcon,
  title,
  description,
  align = "center",
  className,
  action,
}: SectionHeaderProps) {
  const centered = align === "center";

  return (
    <div
      className={cn(
        "mb-10 flex flex-col gap-4",
        centered
          ? "items-center text-center"
          : "sm:flex-row sm:items-end sm:justify-between",
        className
      )}
    >
      <div className={cn("space-y-3", centered && "flex flex-col items-center")}>
        {eyebrow && <Eyebrow icon={eyebrowIcon}>{eyebrow}</Eyebrow>}
        <h2 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
          {title}
        </h2>
        {description && (
          <p className="max-w-2xl text-pretty text-muted-foreground md:text-lg">
            {description}
          </p>
        )}
      </div>
      {action && !centered && <div className="shrink-0">{action}</div>}
    </div>
  );
}
