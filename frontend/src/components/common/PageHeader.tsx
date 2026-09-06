import { Eyebrow } from "@/components/common/Eyebrow";
import { cn } from "@/lib/utils";
import type { IconSvgElement } from "@hugeicons/react";

interface PageHeaderProps {
  title: string;
  description?: string;
  eyebrow?: string;
  eyebrowIcon?: IconSvgElement;
  className?: string;
  /** When true, omit bottom margin — use inside PageStack. */
  compact?: boolean;
  children?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  eyebrow,
  eyebrowIcon,
  className,
  compact = false,
  children,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
        !compact && "mb-10",
        className
      )}
    >
      <div className="space-y-3">
        {eyebrow && <Eyebrow icon={eyebrowIcon}>{eyebrow}</Eyebrow>}
        <h1 className="text-3xl font-bold tracking-tight text-balance md:text-4xl">
          {title}
        </h1>
        {description && (
          <p className="max-w-2xl text-pretty text-muted-foreground md:text-lg">
            {description}
          </p>
        )}
      </div>
      {children && <div className="shrink-0">{children}</div>}
    </div>
  );
}
