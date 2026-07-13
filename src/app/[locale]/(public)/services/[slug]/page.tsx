import { Button } from "antd";
import { IconBadge } from "@/components/common/IconBadge";
import { PageHeader } from "@/components/common/PageHeader";
import { PageLayout } from "@/components/common/PageLayout";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { ServiceOrderButton } from "@/components/public/ServiceOrderButton";
import { buildMetadata } from "@/components/seo/PageSEO";
import { ROUTES } from "@/constants";
import { buildLeadContextUrl } from "@/lib/leads/urls";
import { getUser } from "@/lib/auth/get-user";
import { getServiceBySlug } from "@/lib/services/content";
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

function finalPrice(price: number, discountPercent: number): number {
  return Math.round(price * (1 - discountPercent / 100));
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Service Not Found" };
  return buildMetadata({
    title: service.title,
    description: service.description ?? "",
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
  const service = await getServiceBySlug(slug);
  if (!service) notFound();

  const user = await getUser();
  const icon = SERVICE_ICONS[slug] ?? Globe02Icon;
  const discounted = finalPrice(Number(service.price), Number(service.discount_percent));
  const contactHref = buildLeadContextUrl(ROUTES.contact, { service: slug });

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Service"
        eyebrowIcon={icon}
        title={service.title}
        description={service.description ?? ""}
      />

      <div className="mx-auto max-w-3xl space-y-6">
        <SurfaceCard hover={false} padding="lg">
          <div className="flex items-start gap-4">
            <IconBadge icon={icon} tone="primary" size="lg" />
            <div className="space-y-3">
              <p className="text-muted-foreground leading-relaxed">
                Our {service.title.toLowerCase()} service provides comprehensive support
                tailored to your study abroad goals. Our experienced counselors guide you
                through every step of the process.
              </p>
              {Number(service.price) > 0 ? (
                <div className="flex items-baseline gap-2">
                  {Number(service.discount_percent) > 0 ? (
                    <span className="text-lg text-muted-foreground line-through">
                      ৳{Number(service.price).toLocaleString()}
                    </span>
                  ) : null}
                  <span className="text-2xl font-bold text-primary">
                    ৳{discounted.toLocaleString()}
                  </span>
                  {Number(service.discount_percent) > 0 ? (
                    <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                      {service.discount_percent}% off
                    </span>
                  ) : null}
                </div>
              ) : null}
            </div>
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

        <SurfaceCard hover={false} padding="lg">
          <h2 className="text-lg font-semibold">Order this service</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Submit an order request and our team will confirm details with you. No online payment required.
          </p>
          <div className="mt-4">
            <ServiceOrderButton
              serviceId={service.id}
              serviceTitle={service.title}
              defaultName={user?.profile?.full_name ?? ""}
              defaultEmail={user?.profile?.email ?? user?.email ?? ""}
              defaultPhone={user?.profile?.phone ?? ""}
            />
          </div>
        </SurfaceCard>

        <Link href={contactHref}>
          <Button size="large">
            Ask a question
            <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" data-icon="inline-end" />
          </Button>
        </Link>
      </div>
    </PageLayout>
  );
}
