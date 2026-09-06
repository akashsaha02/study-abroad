import { Button } from "antd";
import { CoverImage } from "@/components/common/CoverImage";
import { PageLayout } from "@/components/common/PageLayout";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { UniversityCard } from "@/features/catalog/components/UniversityCard";
import { buildMetadata } from "@/components/seo/PageSEO";
import { POPULAR_COUNTRIES, ROUTES } from "@/constants";
import { buildLeadContextUrl } from "@/features/leads/urls";
import { FALLBACK_COUNTRIES } from "@/data/fallback";
import { Link } from "@/i18n/navigation";
import { getCountryImage } from "@/lib/images/public-assets";
import { getCountryBySlug, getPublishedUniversities } from "@/features/catalog/queries";
import { ArrowRight01Icon, Money01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ country: string }>;
}

const FLAG_BY_SLUG = Object.fromEntries(
  POPULAR_COUNTRIES.map((c) => [c.slug, c.flag])
);

export async function generateMetadata({ params }: Props) {
  const { country: slug } = await params;
  const country =
    (await getCountryBySlug(slug)) ??
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
  const dbCountry = await getCountryBySlug(slug);
  const country = dbCountry ?? FALLBACK_COUNTRIES.find((c) => c.slug === slug);

  if (!country) notFound();

  const universities = dbCountry?.id
    ? await getPublishedUniversities({ countryId: dbCountry.id })
    : [];

  const sections = [
    { title: `Why Study in ${country.name}?`, content: country.description },
    { title: "Admission Requirements", content: country.admission_requirements },
    { title: "Visa Process", content: country.visa_summary },
  ].filter((s) => s.content);

  const flag = FLAG_BY_SLUG[slug];
  const consultationHref = buildLeadContextUrl(ROUTES.bookConsultation, {
    country: slug,
  });

  return (
    <PageLayout>
      <div className="relative mb-8 overflow-hidden rounded-3xl">
        <CoverImage
          src={getCountryImage(slug)}
          alt={country.name ?? "Country"}
          className="h-52 md:h-64"
          priority
          fallback={
            <span className="text-6xl" aria-hidden>
              {flag ?? "🌍"}
            </span>
          }
        />
        <div className="absolute inset-0 bg-linear-to-t from-background via-background/40 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6 md:p-8">
          <p className="text-sm font-medium text-primary">Destination</p>
          <h1 className="text-2xl font-bold md:text-4xl">
            {country.hero_title ?? `Study in ${country.name}`}
          </h1>
          <p className="mt-2 max-w-2xl text-muted-foreground">
            {country.hero_subtitle ?? country.description}
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          {sections.map((section) => (
            <SurfaceCard key={section.title} hover={false} padding="lg">
              <h2 className="text-xl font-semibold">{section.title}</h2>
              <p className="mt-3 text-muted-foreground leading-relaxed">{section.content}</p>
            </SurfaceCard>
          ))}

          {universities.length > 0 && (
            <section>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-xl font-semibold">Partner Universities</h2>
                <Link
                  href={`${ROUTES.universities}?country=${dbCountry?.id ?? ""}`}
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary"
                >
                  View all
                  <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" />
                </Link>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {universities.slice(0, 6).map((uni) => (
                  <UniversityCard
                    key={uni.id}
                    slug={uni.slug}
                    name={uni.name}
                    city={uni.city}
                    countryName={country.name}
                    ranking={uni.ranking}
                    tuitionMin={uni.tuition_min}
                    logoUrl={uni.logo_url}
                  />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside>
          <SurfaceCard hover={false} padding="lg" className="sticky top-24 space-y-4">
            <h3 className="font-semibold">Cost Overview</h3>
            {country.tuition_min && (
              <div className="flex items-start gap-3">
                <HugeiconsIcon icon={Money01Icon} className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Tuition / year</p>
                  <p className="text-sm font-semibold">
                    ${country.tuition_min?.toLocaleString()} – $
                    {country.tuition_max?.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
            {country.living_cost_min && (
              <div className="flex items-start gap-3">
                <HugeiconsIcon icon={Money01Icon} className="mt-0.5 size-5 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Living costs / month</p>
                  <p className="text-sm font-semibold">
                    ${country.living_cost_min?.toLocaleString()} – $
                    {country.living_cost_max?.toLocaleString()}
                  </p>
                </div>
              </div>
            )}
            <Link href={consultationHref}>
              <Button className="w-full">Book Free Consultation</Button>
            </Link>
          </SurfaceCard>
        </aside>
      </div>
    </PageLayout>
  );
}
