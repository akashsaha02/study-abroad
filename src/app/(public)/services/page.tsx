import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { buildMetadata } from "@/components/seo/PageSEO";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES, SERVICES } from "@/constants";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Our Services",
  description: "Comprehensive study abroad services from admission to pre-departure.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <Container className="py-12">
      <PageHeader
        title="Our Services"
        description="End-to-end support for your international education journey."
      />
      <div className="grid gap-4 md:grid-cols-2">
        {SERVICES.map((service) => (
          <Link key={service.slug} href={`${ROUTES.services}/${service.slug}`}>
            <Card className="h-full transition-shadow hover:shadow-md">
              <CardContent className="p-6">
                <h3 className="font-semibold">{service.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </Container>
  );
}
