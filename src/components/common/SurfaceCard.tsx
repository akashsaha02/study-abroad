import { cn } from "@/lib/utils";
import Link from "next/link";

interface SurfaceCardProps {
  children: React.ReactNode;
  className?: string;
  href?: string;
  hover?: boolean;
  padding?: "none" | "sm" | "md" | "lg";
}

const PADDING = {
  none: "",
  sm: "p-4",
  md: "p-5",
  lg: "p-6",
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
}: SurfaceCardProps) {
  const styles = cn(
    "flex flex-col rounded-2xl border bg-card ring-1 ring-foreground/5",
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
