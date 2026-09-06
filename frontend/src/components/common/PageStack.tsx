import { cn } from "@/lib/utils";

interface StackProps {
  children: React.ReactNode;
  className?: string;
}

/** Consistent vertical rhythm for dashboard pages (no margin collapse). */
export function PageStack({ children, className }: StackProps) {
  return <div className={cn("flex flex-col gap-8", className)}>{children}</div>;
}

/** Spacing between stacked sections inside a grid column or sidebar. */
export function SectionStack({ children, className }: StackProps) {
  return <div className={cn("flex flex-col gap-6", className)}>{children}</div>;
}
