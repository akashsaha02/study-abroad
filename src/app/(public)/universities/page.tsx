import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { EmptyState } from "@/components/common/EmptyState";
import { buildMetadata } from "@/components/seo/PageSEO";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants";
import { FALLBACK_UNIVERSITIES } from "@/data/fallback";
import { getPublishedUniversities } from "@/lib/services/content";
import Link from "next/link";

export const metadata = buildMetadata({
  title: "Universities",
  description: "Explore partner universities worldwide for your study abroad journey.",
  path: "/universities",
});

export default async function UniversitiesPage() {
  const universities = await getPublishedUniversities();
  const list = universities.length ? universities : FALLBACK_UNIVERSITIES;

  return (
    <Container className="py-12">
      <PageHeader
        title="Universities"
        description="Browse our partner universities across top study destinations."
      />
      {list.length === 0 ? (
        <EmptyState title="No universities yet" description="Check back soon." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {list.map((uni) => (
            <Link key={uni.slug} href={`${ROUTES.universities}/${uni.slug}`}>
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <h3 className="font-semibold">{uni.name}</h3>
                  <p className="text-sm text-muted-foreground">{uni.city}</p>
                  {uni.ranking && (
                    <p className="mt-2 text-sm text-primary">{uni.ranking}</p>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </Container>
  );
}
