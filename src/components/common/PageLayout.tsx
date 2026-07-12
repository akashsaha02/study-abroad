import { Container } from "@/components/common/Container";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  /** Adds subtle mesh + grid background behind the page content. */
  withBackground?: boolean;
}

export function PageLayout({
  children,
  className,
  withBackground = true,
}: PageLayoutProps) {
  return (
    <div className={cn("relative", withBackground && "bg-mesh")}>
      {withBackground && (
        <div className="absolute inset-0 -z-10 bg-grid opacity-30" aria-hidden />
      )}
      <Container className={cn("py-12 md:py-16", className)}>
        {children}
      </Container>
    </div>
  );
}
