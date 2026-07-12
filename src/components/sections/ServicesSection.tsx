import { IconBadge } from "@/components/common/IconBadge";
import { SectionHeader } from "@/components/common/SectionHeader";
import { ROUTES } from "@/constants";
import {
  ArrowRight01Icon,
  BookOpen01Icon,
  Briefcase01Icon,
  FileValidationIcon,
  Globe02Icon,
  GraduationScrollIcon,
  PassportIcon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
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

const SERVICE_ICONS: Record<string, IconSvgElement> = {
  "admission-processing": GraduationScrollIcon,
  "student-visa-support": PassportIcon,
  "sop-lor-guidance": FileValidationIcon,
  "scholarship-guidance": BookOpen01Icon,
  "pre-departure-support": Globe02Icon,
  "career-counseling": Briefcase01Icon,
};

export function ServicesSection({ services }: ServicesSectionProps) {
  return (
    <Section>
      <SectionHeader
        eyebrow="What we do"
        eyebrowIcon={SparklesIcon}
        title="End-to-end study abroad support"
        description="Every part of your journey is covered — from choosing a course to landing at your campus."
      />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {services.map((service) => {
          const icon = SERVICE_ICONS[service.slug] ?? Globe02Icon;
          return (
            <Link
              key={service.slug}
              href={`${ROUTES.services}/${service.slug}`}
              className="group flex flex-col rounded-2xl border bg-card p-6 ring-1 ring-foreground/5 transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
            >
              <IconBadge icon={icon} tone="primary" />
              <h3 className="mt-4 font-semibold">{service.title}</h3>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">
                {service.description}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Learn more
                <HugeiconsIcon
                  icon={ArrowRight01Icon}
                  className="size-4 transition-transform group-hover:translate-x-0.5"
                />
              </span>
            </Link>
          );
        })}
      </div>
    </Section>
  );
}
