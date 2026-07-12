import { cn } from "@/lib/utils";
import Link from "next/link";

export interface FilterChip {
  label: string;
  value: string;
  href: string;
}

interface FilterChipsProps {
  chips: FilterChip[];
  activeValue?: string;
  className?: string;
}

/**
 * Pill-style filter row used on universities, courses, and similar listing pages.
 */
export function FilterChips({
  chips,
  activeValue,
  className,
}: FilterChipsProps) {
  return (
    <div className={cn("mb-8 flex flex-wrap gap-2", className)}>
      {chips.map((chip) => {
        const active = activeValue === chip.value;
        return (
          <Link
            key={chip.value}
            href={chip.href}
            className={cn(
              "rounded-4xl border px-4 py-1.5 text-sm font-medium transition-colors",
              active
                ? "border-primary bg-primary text-primary-foreground"
                : "border-input text-muted-foreground hover:border-primary/30 hover:bg-muted hover:text-foreground"
            )}
            aria-current={active ? "page" : undefined}
          >
            {chip.label}
          </Link>
        );
      })}
    </div>
  );
}
