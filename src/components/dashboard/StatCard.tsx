import { IconBadge } from "@/components/common/IconBadge";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { cn } from "@/lib/utils";
import type { IconSvgElement } from "@hugeicons/react";

type StatTone = "primary" | "success" | "sky" | "violet" | "amber" | "rose";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  className?: string;
  icon?: IconSvgElement;
  tone?: StatTone;
}

export function StatCard({
  title,
  value,
  description,
  className,
  icon,
  tone = "primary",
}: StatCardProps) {
  return (
    <SurfaceCard hover={false} className={cn("gap-3", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        {icon && <IconBadge icon={icon} tone={tone} size="sm" />}
      </div>
      <p className="text-3xl font-bold tracking-tight">{value}</p>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </SurfaceCard>
  );
}
