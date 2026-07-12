import { Button } from "antd";
import { IconBadge } from "@/components/common/IconBadge";
import { PageHeader } from "@/components/common/PageHeader";
import { PageLayout } from "@/components/common/PageLayout";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { buildMetadata } from "@/components/seo/PageSEO";
import { ROUTES, SERVICES } from "@/constants";
import {
  ArrowRight01Icon,
  BookOpen01Icon,
  Briefcase01Icon,
  FileValidationIcon,
  Globe02Icon,
  GraduationScrollIcon,
  PassportIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";
import Link from "next/link";
import { notFound } from "next/navigation";

const SERVICE_ICONS: Record<string, IconSvgElement> = {
  "admission-processing": GraduationScrollIcon,
  "student-visa-support": PassportIcon,
  "sop-lor-guidance": FileValidationIcon,
  "scholarship-guidance": BookOpen01Icon,
  "pre-departure-support": Globe02Icon,
  "career-counseling": Briefcase01Icon,
};

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) return { title: "Service Not Found" };
  return buildMetadata({
    title: service.title,
    description: service.description,
    path: `/services/${slug}`,
  });
}

const SERVICE_FEATURES = [
  "Personalized consultation and planning",
  "Document preparation and review",
  "Application submission support",
  "Regular progress updates",
];

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  const icon = SERVICE_ICONS[slug] ?? Globe02Icon;

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Service"
        eyebrowIcon={icon}
        title={service.title}
        description={service.description}
      />

      <div className="mx-auto max-w-3xl space-y-6">
        <SurfaceCard hover={false} padding="lg">
          <div className="flex items-start gap-4">
            <IconBadge icon={icon} tone="primary" size="lg" />
            <p className="text-muted-foreground leading-relaxed">
              Our {service.title.toLowerCase()} service provides comprehensive support
              tailored to your study abroad goals. Our experienced counselors guide you
              through every step of the process.
            </p>
          </div>
        </SurfaceCard>

        <SurfaceCard hover={false} padding="lg">
          <h2 className="text-lg font-semibold">What&apos;s included</h2>
          <ul className="mt-4 space-y-3">
            {SERVICE_FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-3 text-sm">
                <span className="size-1.5 shrink-0 rounded-full bg-primary" />
                {feature}
              </li>
            ))}
          </ul>
        </SurfaceCard>

        <Link href={ROUTES.contact}>
          <Button size="large">
            Get Started
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" data-icon="inline-end" />
          </Button>
        </Link>
      </div>
    </PageLayout>
  );
}
