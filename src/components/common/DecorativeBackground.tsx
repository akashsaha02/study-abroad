import { cn } from "@/lib/utils";

interface DecorativeBackgroundProps {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "primary" | "success" | "muted";
  showGrid?: boolean;
  showLines?: boolean;
  showMesh?: boolean;
}

const VARIANT_CLASS = {
  default: "",
  primary: "section-texture-primary",
  success: "section-texture-success",
  muted: "bg-muted/40",
} as const;

export function DecorativeBackground({
  children,
  className,
  variant = "default",
  showGrid = false,
  showLines = false,
  showMesh = false,
}: DecorativeBackgroundProps) {
  return (
    <div className={cn("relative overflow-hidden", VARIANT_CLASS[variant], className)}>
      {showMesh && <div className="absolute inset-0 bg-mesh" aria-hidden />}
      {showLines && (
        <div className="absolute inset-0 bg-grid-lines opacity-50" aria-hidden />
      )}
      {showGrid && (
        <div className="absolute inset-0 bg-grid opacity-35" aria-hidden />
      )}
      <div className="relative">{children}</div>
    </div>
  );
}
