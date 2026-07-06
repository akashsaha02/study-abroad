import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { buildMetadata } from "@/components/seo/PageSEO";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants";
import { FALLBACK_UNIVERSITIES } from "@/data/fallback";
import { getPublishedCountries, getPublishedUniversities } from "@/lib/services/content";
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

  return (
    <Container className="py-12">
      <PageHeader
        title="Universities"
        description="Browse our partner universities across top study destinations."
      />

      {countries.length > 0 && (
        <div className="mb-8 flex flex-wrap gap-2">
          <Link
            href={ROUTES.universities}
            className={`rounded-full border px-3 py-1 text-sm ${!countryId ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
          >
            All
          </Link>
          {countries.map((c) => (
            <Link
              key={c.id}
              href={`${ROUTES.universities}?country=${c.id}`}
              className={`rounded-full border px-3 py-1 text-sm ${countryId === c.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"}`}
            >
              {c.name}
            </Link>
          ))}
        </div>
      )}

      {list.length === 0 ? (
        <EmptyState title="No universities yet" description="Check back soon." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((uni) => {
            const countryName = (uni as { countries?: { name?: string } }).countries?.name;
            return (
              <Link key={uni.slug} href={`${ROUTES.universities}/${uni.slug}`}>
                <Card className="h-full transition-shadow hover:shadow-md">
                  <CardContent className="p-6">
                    <h3 className="font-semibold">{uni.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {[uni.city, countryName].filter(Boolean).join(" · ")}
                    </p>
                    {uni.ranking && (
                      <p className="mt-2 text-sm text-primary">{uni.ranking}</p>
                    )}
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </Container>
  );
}
