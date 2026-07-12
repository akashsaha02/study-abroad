import { PageHeader } from "@/components/common/PageHeader";
import { PageLayout } from "@/components/common/PageLayout";
import { ServiceCard } from "@/components/public/ServiceCard";
import { buildMetadata } from "@/components/seo/PageSEO";
import { SERVICES } from "@/constants";
import { Briefcase01Icon } from "@hugeicons/core-free-icons";

export const metadata = buildMetadata({
  title: "Our Services",
  description: "Comprehensive study abroad services from admission to pre-departure.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <PageLayout>
      <PageHeader
        eyebrow="What we do"
        eyebrowIcon={Briefcase01Icon}
        title="Our services"
        description="End-to-end support for your international education journey."
      />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service) => (
          <ServiceCard
            key={service.slug}
            slug={service.slug}
            title={service.title}
            description={service.description}
          />
        ))}
      </div>
    </PageLayout>
  );
}
