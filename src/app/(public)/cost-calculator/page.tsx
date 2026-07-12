import { PageLayout } from "@/components/common/PageLayout";
import { CostCalculator } from "@/components/public/CostCalculator";
import { buildMetadata } from "@/components/seo/PageSEO";
import { buildCostMap } from "@/lib/cost/build-cost-map";
import { getCostSettings, getPublishedCountries } from "@/lib/services/content";

export const metadata = buildMetadata({
  title: "Cost Calculator",
  description: "Estimate your total study abroad budget including tuition, living costs, and fees.",
  path: "/cost-calculator",
});

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
