import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { buildMetadata } from "@/components/seo/PageSEO";
import { Card, CardContent } from "@/components/ui/card";
import { ROUTES } from "@/constants";
import { FALLBACK_COUNTRIES } from "@/data/fallback";
import { getPublishedCountries } from "@/lib/services/content";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ country: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { country: slug } = await params;
  const country =
    (await getPublishedCountries()).find((c) => c.slug === slug) ??
    FALLBACK_COUNTRIES.find((c) => c.slug === slug);

  if (!country) return { title: "Country Not Found" };

  return buildMetadata({
    title: `Study in ${country.name}`,
    description: country.description ?? `Complete guide to studying in ${country.name}.`,
    path: `/study-in/${slug}`,
  });
}

export default async function CountryPage({ params }: Props) {
  const { country: slug } = await params;
  const countries = await getPublishedCountries();
  const country =
    countries.find((c) => c.slug === slug) ??
    FALLBACK_COUNTRIES.find((c) => c.slug === slug);

  if (!country) notFound();

  return (
    <Container className="py-12">
      <PageHeader
        title={country.hero_title ?? `Study in ${country.name}`}
        description={country.hero_subtitle ?? country.description ?? undefined}
      />

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-8">
          {country.description && (
            <section>
              <h2 className="text-xl font-semibold">Why Study in {country.name}?</h2>
              <p className="mt-2 text-muted-foreground">{country.description}</p>
            </section>
          )}
          {country.admission_requirements && (
            <section>
              <h2 className="text-xl font-semibold">Admission Requirements</h2>
              <p className="mt-2 text-muted-foreground">{country.admission_requirements}</p>
            </section>
          )}
          {country.visa_summary && (
            <section>
              <h2 className="text-xl font-semibold">Visa Process</h2>
              <p className="mt-2 text-muted-foreground">{country.visa_summary}</p>
            </section>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-3">
              <h3 className="font-semibold">Cost Overview</h3>
              {country.tuition_min && (
                <p className="text-sm">
                  Tuition: ${country.tuition_min?.toLocaleString()} – $
                  {country.tuition_max?.toLocaleString()}/year
                </p>
              )}
              {country.living_cost_min && (
                <p className="text-sm">
                  Living: ${country.living_cost_min?.toLocaleString()} – $
                  {country.living_cost_max?.toLocaleString()}/month
                </p>
              )}
            </CardContent>
          </Card>
          <Link
            href={ROUTES.contact}
            className="block rounded-lg bg-primary px-4 py-3 text-center text-sm font-medium text-primary-foreground"
          >
            Book Free Consultation
          </Link>
        </div>
      </div>
    </Container>
  );
}
