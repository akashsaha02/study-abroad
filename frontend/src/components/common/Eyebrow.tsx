import { cn } from "@/lib/utils";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

interface EyebrowProps {
  children: React.ReactNode;
  icon?: IconSvgElement;
  className?: string;
}

/**
 * Small uppercase label rendered above section titles to add hierarchy
 * without competing with the heading.
 */
export function Eyebrow({ children, icon, className }: EyebrowProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-4xl border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-primary",
        className
      )}
    >
      {icon && <HugeiconsIcon icon={icon} className="size-3.5" />}
      {children}
    </span>
  );
}
