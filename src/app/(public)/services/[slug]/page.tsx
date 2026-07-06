import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { buildMetadata } from "@/components/seo/PageSEO";
import { Button } from "@/components/ui/button";
import { ROUTES, SERVICES } from "@/constants";
import Link from "next/link";
import { notFound } from "next/navigation";

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

export default async function ServiceDetailPage({ params }: Props) {
  const { slug } = await params;
  const service = SERVICES.find((s) => s.slug === slug);
  if (!service) notFound();

  return (
    <Container className="py-12">
      <PageHeader title={service.title} description={service.description} />
      <div className="prose prose-neutral max-w-3xl dark:prose-invert">
        <p>
          Our {service.title.toLowerCase()} service provides comprehensive support
          tailored to your study abroad goals. Our experienced counselors guide you
          through every step of the process.
        </p>
        <ul>
          <li>Personalized consultation and planning</li>
          <li>Document preparation and review</li>
          <li>Application submission support</li>
          <li>Regular progress updates</li>
        </ul>
      </div>
      <Button asChild className="mt-8">
        <Link href={ROUTES.contact}>Get Started</Link>
      </Button>
    </Container>
  );
}
