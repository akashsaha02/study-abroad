import { cn } from "@/lib/utils";
import Link from "next/link";

export type SurfaceCardVariant = "solid" | "glass" | "glass-strong";

interface SurfaceCardProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
  variant?: SurfaceCardVariant;
  shine?: boolean;
}

const PADDING = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
};

const VARIANT_CLASSES: Record<SurfaceCardVariant, string> = {
  solid: "border bg-card ring-1 ring-foreground/5",
  glass: "glass glass-shine border-0 ring-0",
  "glass-strong": "glass-strong glass-shine border-0 ring-0",
};

/**
 * Unified interactive card used across public pages, dashboards, and tools.
 * Replaces scattered `Card` + `hover:shadow-md` patterns.
 */
export function SurfaceCard({
  children,
  className,
  href,
  hover = true,
  padding = "md",
  variant = "solid",
  shine = true,
}: SurfaceCardProps) {
  const styles = cn(
    "flex flex-col rounded-2xl",
    VARIANT_CLASSES[variant],
    shine && variant !== "solid" && "glass-shine",
    PADDING[padding],
    hover &&
      "transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg",
    className
  );

  if (href) {
    return (
      <Link href={href} className={cn(styles, "group")}>
        {children}
      </Link>
    );
  }

  return <div className={styles}>{children}</div>;
}
