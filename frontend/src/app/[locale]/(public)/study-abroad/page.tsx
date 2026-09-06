import { CoverImage } from "@/components/common/CoverImage";
import { DecorativeBackground } from "@/components/common/DecorativeBackground";
import { PageHeader } from "@/components/common/PageHeader";
import { PageLayout } from "@/components/common/PageLayout";
import { buildMetadata } from "@/components/seo/PageSEO";
import { POPULAR_COUNTRIES, ROUTES } from "@/constants";
import { FALLBACK_COUNTRIES } from "@/data/fallback";
import { Link } from "@/i18n/navigation";
import { getLocalizedCountryDescription } from "@/lib/fallback-i18n";
import { getCountryImage } from "@/lib/images/public-assets";
import { getPublishedCountries } from "@/features/catalog/queries";
import { ArrowRight01Icon, Globe02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, Tag } from "antd";
import { getTranslations } from "next-intl/server";

export async function generateMetadata() {
  const t = await getTranslations("public.studyAbroad");
  return buildMetadata({
    title: t("title"),
    description: t("description"),
    path: "/study-abroad",
  });
}

const FLAG_BY_SLUG = Object.fromEntries(
  POPULAR_COUNTRIES.map((c) => [c.slug, c.flag])
);

export default async function StudyAbroadPage() {
  const t = await getTranslations("public.studyAbroad");
  const tCountries = await getTranslations("fallback.countries");
  const published = await getPublishedCountries();
  const countries =
    published.length > 0
      ? published
      : FALLBACK_COUNTRIES.map((c) => ({
          ...c,
          id: c.id!,
          name: c.name!,
          slug: c.slug!,
        }));

  return (
    <PageLayout>
      <DecorativeBackground variant="primary" showMesh className="-mx-4 mb-10 rounded-3xl px-4 py-10 md:-mx-6 md:px-6">
        <PageHeader
          eyebrow={t("eyebrow")}
          eyebrowIcon={Globe02Icon}
          title={t("title")}
          description={t("description")}
        >
          <Link href={ROUTES.eligibilityChecker}>
            <Button type="primary" size="large">
              {t("ctaEligibility")}
            </Button>
          </Link>
        </PageHeader>
      </DecorativeBackground>

      <div className="stagger-children grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((country) => {
          const description = getLocalizedCountryDescription(
            country.slug,
            (key) =>
              tCountries(
                key as "uk" | "canada" | "australia" | "usa" | "malaysia" | "germany"
              ),
            country.description
          );
          const flag = FLAG_BY_SLUG[country.slug];
          return (
            <Link
              key={country.slug}
              href={ROUTES.studyIn(country.slug)}
              className="group overflow-hidden rounded-2xl border bg-card ring-1 ring-foreground/5 transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-40">
                <CoverImage
                  src={getCountryImage(country.slug)}
                  alt={country.name}
                  className="h-full"
                  fallback={
                    <span className="text-5xl" aria-hidden>
                      {flag ?? "🌍"}
                    </span>
                  }
                />
                <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-xl shadow-sm backdrop-blur-sm">
                  {flag ?? "🌍"}
                </span>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between gap-2">
                  <h2 className="text-lg font-semibold">{country.name}</h2>
                  {"tuition_min" in country && country.tuition_min && (
                    <Tag>${country.tuition_min.toLocaleString()}+/yr</Tag>
                  )}
                </div>
                <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                  {description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  {t("explore")}
                  <HugeiconsIcon
                    icon={ArrowRight01Icon}
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </PageLayout>
  );
}
