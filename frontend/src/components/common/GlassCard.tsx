import { IconBadge } from "@/components/common/IconBadge";
import { PanelCard } from "@/components/common/PanelCard";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { cn } from "@/lib/utils";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import Image from "next/image";
import type { SurfaceCardVariant } from "./SurfaceCard";

type GlassTone = "primary" | "success" | "sky" | "violet" | "amber" | "rose";

interface GlassFeatureCardProps {
  icon: IconSvgElement;
  title: string;
  description: string;
  href?: string;
  tone?: GlassTone;
  className?: string;
}

export function GlassFeatureCard({
  icon,
  title,
  description,
  href,
  tone = "primary",
  className,
}: GlassFeatureCardProps) {
  return (
    <SurfaceCard href={href} variant="glass" className={className}>
      <IconBadge icon={icon} tone={tone} />
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{description}</p>
      {href && (
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
          Learn more
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </span>
      )}
    </SurfaceCard>
  );
}

interface GlassStatCardProps {
  label: string;
  value: string | number | React.ReactNode;
  description?: string;
  icon?: IconSvgElement;
  tone?: GlassTone;
  trend?: string;
  className?: string;
  variant?: SurfaceCardVariant;
}

export function GlassStatCard({
  label,
  value,
  description,
  icon,
  tone = "primary",
  trend,
  className,
  variant = "glass",
}: GlassStatCardProps) {
  return (
    <SurfaceCard hover={false} variant={variant} className={cn("gap-3", className)}>
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        {icon && <IconBadge icon={icon} tone={tone} size="sm" />}
      </div>
      <div className="text-3xl font-bold tracking-tight">
        {typeof value === "string" || typeof value === "number" ? value : value}
      </div>
      {(description || trend) && (
        <p className="text-xs text-muted-foreground">
          {trend && <span className="text-success">{trend} </span>}
          {description}
        </p>
      )}
    </SurfaceCard>
  );
}

interface GlassMediaCardProps {
  title: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  badge?: string;
  meta?: string;
  href?: string;
  className?: string;
}

export function GlassMediaCard({
  title,
  description,
  image,
  imageAlt,
  badge,
  meta,
  href,
  className,
}: GlassMediaCardProps) {
  return (
    <SurfaceCard href={href} variant="glass" padding="none" className={cn("overflow-hidden", className)}>
      {image && (
        <div className="relative aspect-[16/10] w-full overflow-hidden">
          <Image
            src={image}
            alt={imageAlt ?? title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
          {badge && (
            <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-white/20 px-2.5 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
              {badge}
            </span>
          )}
        </div>
      )}
      <div className="p-5">
        <h3 className="font-semibold">{title}</h3>
        {meta && <p className="mt-1 text-xs text-muted-foreground">{meta}</p>}
        {description && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{description}</p>
        )}
      </div>
    </SurfaceCard>
  );
}

interface GlassPanelCardProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  variant?: SurfaceCardVariant;
}

export function GlassPanelCard({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
  variant = "glass",
}: GlassPanelCardProps) {
  return (
    <PanelCard
      title={title}
      description={description}
      action={action}
      className={className}
      contentClassName={contentClassName}
      variant={variant}
    >
      {children}
    </PanelCard>
  );
}
