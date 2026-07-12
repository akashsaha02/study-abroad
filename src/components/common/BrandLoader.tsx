import { APP_NAME } from "@/constants";
import { cn } from "@/lib/utils";

interface BrandLoaderProps {
  fullScreen?: boolean;
  className?: string;
  /** Pass from a server loading boundary when locale messages are available. */
  label?: string;
}

export function BrandLoader({
  fullScreen,
  className,
  label = "Loading...",
}: BrandLoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-5",
        fullScreen && "min-h-[50vh] p-8",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label={label}
    >
      <div className="relative flex size-14 items-center justify-center">
        <span
          className="absolute inset-0 rounded-full border-2 border-primary/15"
          aria-hidden
        />
        <span
          className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary motion-reduce:animate-none"
          aria-hidden
        />
        <span className="size-3 rounded-full bg-primary" aria-hidden />
      </div>
      <div className="text-center">
        <p className="text-lg font-semibold tracking-tight text-foreground">
          {APP_NAME}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}
