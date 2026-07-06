import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants";
import Link from "next/link";
import { Section } from "../common/Section";

interface Service {
  slug: string;
  title: string;
  description: string;
}

interface ServicesSectionProps {
  services: Service[];
}

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <Section>
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold">Our Services</h2>
        <p className="mt-2 text-muted-foreground">
          End-to-end support for your study abroad journey
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => (
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
    </Section>
  );
}
