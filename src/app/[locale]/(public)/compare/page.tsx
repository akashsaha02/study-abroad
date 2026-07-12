import { PageHeader } from "@/components/common/PageHeader";
import { PageLayout } from "@/components/common/PageLayout";
import { ComparisonMatrix } from "@/components/compare/ComparisonMatrix";
import { buildMetadata } from "@/components/seo/PageSEO";
import { COMPARE_UNIVERSITIES } from "@/data/compare";
import { mapDbUniversityToCompare } from "@/lib/compare/map-universities";
import { getPublishedUniversities } from "@/lib/services/content";
import { Globe02Icon } from "@hugeicons/core-free-icons";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("public.compare");
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/compare",
  });
}

export default async function ComparePage() {
  const t = await getTranslations("public.compare");
  const dbUniversities = await getPublishedUniversities();
  const universities =
    dbUniversities.length > 0
      ? dbUniversities.map(mapDbUniversityToCompare)
      : COMPARE_UNIVERSITIES;

  return (
    <PageLayout>
      <PageHeader
        eyebrow={t("eyebrow")}
        eyebrowIcon={Globe02Icon}
        title={t("title")}
        description={t("description")}
      />
      <ComparisonMatrix universities={universities} />
    </PageLayout>
  );
}
