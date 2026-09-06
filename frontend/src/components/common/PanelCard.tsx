import { cn } from "@/lib/utils";
import type { SurfaceCardVariant } from "./SurfaceCard";

interface PanelCardProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  padding?: boolean;
  variant?: SurfaceCardVariant;
}

const VARIANT_CLASSES: Record<SurfaceCardVariant, string> = {
  solid: "border bg-card ring-1 ring-foreground/5",
  glass: "glass glass-shine border-0 ring-0",
  "glass-strong": "glass-strong glass-shine border-0 ring-0",
};

/**
 * Dashboard panel wrapper with optional header row. Used for account
 * summaries, notifications, application cards, and form panels.
 */
export function PanelCard({
  title,
  description,
  action,
  children,
  className,
  contentClassName,
  padding = true,
  variant = "solid",
}: PanelCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl",
        VARIANT_CLASSES[variant],
        variant !== "solid" && "glass-shine",
        className
      )}
    >
      {(title || action) && (
        <div className="flex items-start justify-between gap-4 border-b border-foreground/5 px-5 py-4">
          <div>
            {title && <h3 className="font-semibold">{title}</h3>}
            {description && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>
          {action}
        </div>
      )}
      <div className={cn(padding && "p-5", contentClassName)}>{children}</div>
    </div>
  );
}
