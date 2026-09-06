import { PageLayout } from "@/components/common/PageLayout";
import { CostCalculator } from "@/components/public/CostCalculator";
import { buildMetadata } from "@/components/seo/PageSEO";
import { buildCostMap } from "@/lib/cost/build-cost-map";
import { getCostSettings, getPublishedCountries } from "@/lib/services/content";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("public.costCalculator");
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/cost-calculator",
  });
}

export default async function CostCalculatorPage() {
  const [settings, countries] = await Promise.all([
    getCostSettings(),
    getPublishedCountries(),
  ]);

  const costsByCountry = buildCostMap(
    settings,
    countries.map((c) => ({ id: c.id, slug: c.slug, name: c.name }))
  );

  return (
    <PageLayout>
      <CostCalculator costsByCountry={costsByCountry} />
    </PageLayout>
  );
}
