import { Button } from "antd";
import { EmptyState } from "@/components/common/EmptyState";
import { FilterChips } from "@/components/common/FilterChips";
import { PageHeader } from "@/components/common/PageHeader";
import { PageLayout } from "@/components/common/PageLayout";
import { UniversityCard } from "@/components/public/UniversityCard";
import { buildMetadata } from "@/components/seo/PageSEO";
import { ROUTES } from "@/constants";
import { FALLBACK_UNIVERSITIES } from "@/data/fallback";
import { getPublishedCountries, getPublishedUniversities } from "@/lib/services/content";
import { UniversityIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Universities",
  description: "Explore partner universities worldwide for your study abroad journey.",
  path: "/universities",
});

interface Props {
  searchParams: Promise<{ country?: string }>;
}

export default async function UniversitiesPage({ searchParams }: Props) {
  const { country: countryId } = await searchParams;
  const [countries, universities] = await Promise.all([
    getPublishedCountries(),
    getPublishedUniversities({ countryId: countryId || undefined }),
  ]);
  const list = universities.length ? universities : countryId ? [] : FALLBACK_UNIVERSITIES;

  const chips = [
    { label: "All", value: "", href: ROUTES.universities },
    ...countries.map((c) => ({
      label: c.name,
      value: c.id,
      href: `${ROUTES.universities}?country=${c.id}`,
    })),
  ];

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Explore"
        eyebrowIcon={UniversityIcon}
        title="Universities"
        description="Browse our partner universities across top study destinations."
      >
        <Link href={ROUTES.compare}>
          <Button >Compare universities</Button>
        </Link>
      </PageHeader>

      {countries.length > 0 && (
        <FilterChips chips={chips} activeValue={countryId ?? ""} />
      )}

      {list.length === 0 ? (
        <EmptyState
          title="No universities yet"
          description="Try another country filter or check back soon."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((uni) => {
            const countryName = (uni as { countries?: { name?: string } })
              .countries?.name;
            return (
              <UniversityCard
                key={uni.slug}
                slug={uni.slug!}
                name={uni.name!}
                city={uni.city}
                countryName={countryName}
                ranking={uni.ranking}
                tuitionMin={uni.tuition_min}
              />
            );
          })}
        </div>
      )}
    </PageLayout>
  );
}
