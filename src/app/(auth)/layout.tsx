import { Container } from "@/components/common/Container";
import { Card, CardContent } from "@/components/ui/card";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Container size="narrow">
        <Card className="w-full">
          <CardContent className="p-6 md:p-8">{children}</CardContent>
        </Card>
      </Container>
    </div>
  );
}
