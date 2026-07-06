import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants";
import {
  BookOpen01Icon,
  Briefcase01Icon,
  FileValidationIcon,
  Globe02Icon,
  GraduationScrollIcon,
  PassportIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
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

const SERVICE_ICONS: Record<string, typeof Globe02Icon> = {
  "university-admissions": GraduationScrollIcon,
  "visa-assistance": PassportIcon,
  "scholarship-guidance": BookOpen01Icon,
  "admission-processing": FileValidationIcon,
  "career-counseling": Briefcase01Icon,
  "pre-departure": Globe02Icon,
};

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
        {services.map((service) => {
          const icon = SERVICE_ICONS[service.slug] ?? Globe02Icon;
          return (
            <Link key={service.slug} href={`${ROUTES.services}/${service.slug}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <HugeiconsIcon icon={icon} className="size-5" strokeWidth={1.75} />
                  </div>
                  <h3 className="font-semibold">{service.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
