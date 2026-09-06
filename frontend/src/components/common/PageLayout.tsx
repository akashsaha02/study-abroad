import { Container } from "@/components/common/Container";
import { cn } from "@/lib/utils";

interface PageLayoutProps {
  children: React.ReactNode;
  className?: string;
  /** Kept for API compatibility; global SiteBackground handles page texture. */
  withBackground?: boolean;
}

export function PageLayout({
  children,
  className,
}: PageLayoutProps) {
  return (
    <div className="relative">
      <Container className={cn("py-12 md:py-16", className)}>
        {children}
      </Container>
    </div>
  );
}
