import { PageHeader } from "@/components/common/PageHeader";
import { PageLayout } from "@/components/common/PageLayout";
import { ComparisonMatrix } from "@/components/compare/ComparisonMatrix";
import { buildMetadata } from "@/components/seo/PageSEO";
import { COMPARE_UNIVERSITIES } from "@/data/compare";
import { mapDbUniversityToCompare } from "@/lib/compare/map-universities";
import { getPublishedUniversities } from "@/lib/services/content";
import { Globe02Icon } from "@hugeicons/core-free-icons";

export const metadata = buildMetadata({
  title: "Compare Universities",
  description:
    "Compare up to 3 universities side-by-side on tuition, global ranking, and cost of living.",
  path: "/compare",
});

export default async function ComparePage() {
  const dbUniversities = await getPublishedUniversities();
  const universities =
    dbUniversities.length > 0
      ? dbUniversities.map(mapDbUniversityToCompare)
      : COMPARE_UNIVERSITIES;

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Decision tool"
        eyebrowIcon={Globe02Icon}
        title="Compare universities"
        description="Put up to 3 universities head-to-head on the metrics that decide where you'll thrive."
      />
      <ComparisonMatrix universities={universities} />
    </PageLayout>
  );
}
