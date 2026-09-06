import { IconBadge } from "@/components/common/IconBadge";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { cn } from "@/lib/utils";
import type { IconSvgElement } from "@hugeicons/react";
import type { SurfaceCardVariant } from "@/components/common/SurfaceCard";
import { Statistic } from "antd";

type StatTone = "primary" | "success" | "sky" | "violet" | "amber" | "rose";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  className?: string;
  icon?: IconSvgElement;
  tone?: StatTone;
  variant?: SurfaceCardVariant;
}

export function StatCard({
  title,
  value,
  description,
  className,
  icon,
  tone = "primary",
  variant = "solid",
}: StatCardProps) {
  return (
    <SurfaceCard hover={false} variant={variant} className={cn("gap-1", className)}>
      <div className="flex items-start justify-between gap-3">
        <Statistic
          title={title}
          value={value}
          styles={{
            content: {
              fontWeight: 700,
              letterSpacing: "-0.025em",
              fontSize: "1.875rem",
              lineHeight: 1.2,
              color: "var(--foreground)",
            },
          }}
        />
        {icon && <IconBadge icon={icon} tone={tone} size="sm" />}
      </div>
      {description && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </SurfaceCard>
  );
}
