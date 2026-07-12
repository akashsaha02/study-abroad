import { PageHeader } from "@/components/common/PageHeader";
import { PageLayout } from "@/components/common/PageLayout";
import { ServiceCard } from "@/components/public/ServiceCard";
import { buildMetadata } from "@/components/seo/PageSEO";
import { SERVICES } from "@/constants";
import { getLocalizedService } from "@/lib/fallback-i18n";
import { Briefcase01Icon } from "@hugeicons/core-free-icons";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("public.services");
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/services",
  });
}

export default async function ServicesPage() {
  const t = await getTranslations("public.services");
  const tServices = await getTranslations("fallback.services");

  return (
    <PageLayout>
      <PageHeader
        eyebrow={t("eyebrow")}
        eyebrowIcon={Briefcase01Icon}
        title={t("title")}
        description={t("description")}
      />
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service) => {
          const localized = getLocalizedService(service.slug, (key) =>
            tServices(key as `${typeof service.slug}.title` | `${typeof service.slug}.description`)
          );
          return (
            <ServiceCard
              key={service.slug}
              slug={service.slug}
              title={localized.title}
              description={localized.description}
            />
          );
        })}
      </div>
    </PageLayout>
  );
}
