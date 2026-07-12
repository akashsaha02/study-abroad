import { cn } from "@/lib/utils";

interface PanelCardProps {
  title?: string;
  description?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  padding?: boolean;
}

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
}: PanelCardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl border bg-card ring-1 ring-foreground/5",
        className
      )}
    >
      {(title || action) && (
        <div className="flex items-start justify-between gap-4 border-b px-5 py-4">
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
