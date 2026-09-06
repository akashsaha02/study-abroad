import { CoverImage } from "@/components/common/CoverImage";
import { SectionHeader } from "@/components/common/SectionHeader";
import { Container } from "@/components/common/Container";
import { POPULAR_COUNTRIES, ROUTES } from "@/constants";
import { Link } from "@/i18n/navigation";
import { getLocalizedCountryDescription } from "@/lib/fallback-i18n";
import { getCountryImage } from "@/lib/images/public-assets";
import { cn } from "@/lib/utils";
import type { Country } from "@/types";
import { ArrowRight01Icon, Globe02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tag } from "antd";
import { getTranslations } from "next-intl/server";

interface PopularDestinationsProps {
  countries: Partial<Country>[];
  useFallbackDescriptions?: boolean;
}

const FLAG_BY_SLUG: Record<string, string> = Object.fromEntries(
  POPULAR_COUNTRIES.map((c) => [c.slug, c.flag]),
);

export async function PopularDestinations({
  countries,
  useFallbackDescriptions = false,
}: PopularDestinationsProps) {
  const t = await getTranslations("home.destinations");
  const tCountries = await getTranslations("fallback.countries");

  return (
    <section className="relative isolate overflow-hidden py-16 md:py-24">
      {/* Doodle texture — CSS background avoids fill/overlay stacking issues */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/images/doodle-bg-img2.png')" }}
        />
        <div className="absolute inset-0 bg-background/30 dark:bg-background/45" />
        <div className="absolute inset-0 bg-linear-to-b from-background/80 via-background/10 to-background/80" />
      </div>

      <Container className="relative">
        <SectionHeader
          eyebrow={t("eyebrow")}
          eyebrowIcon={Globe02Icon}
          title={t("title")}
          description={t("description")}
        />

        <div className="stagger-children grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {countries.map((country) => {
            const flag = country.slug ? FLAG_BY_SLUG[country.slug] : undefined;
            const description = useFallbackDescriptions
              ? getLocalizedCountryDescription(
                  country.slug,
                  (key) =>
                    tCountries(
                      key as
                        | "uk"
                        | "canada"
                        | "australia"
                        | "usa"
                        | "malaysia"
                        | "germany",
                    ),
                  country.description,
                )
              : country.description;
            const imageSrc = getCountryImage(country.slug);

            return (
              <Link
                key={country.slug}
                href={ROUTES.studyIn(country.slug!)}
                className={cn(
                  "glass glass-shine group relative flex flex-col overflow-hidden rounded-2xl border border-border/70 shadow-sm",
                  "transition-all duration-200 hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg",
                )}
              >
                <div className="relative h-40 overflow-hidden">
                  <CoverImage
                    src={imageSrc}
                    alt={country.name ?? "Country"}
                    className="h-full"
                    imageClassName="transition-transform duration-300 group-hover:scale-105"
                    fallback={
                      <span className="text-5xl drop-shadow-sm" aria-hidden>
                        {flag ?? "🌍"}
                      </span>
                    }
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-card via-card/20 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full border border-border/50 bg-background/90 px-2.5 py-1 text-lg shadow-sm backdrop-blur-sm">
                    {flag ?? "🌍"}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-lg font-semibold leading-tight">
                      {country.name}
                    </h3>
                    {country.tuition_min != null && (
                      <Tag className="m-0 shrink-0 border-primary/15 bg-primary/5 text-primary">
                        {t("fromPerYear", {
                          price: country.tuition_min.toLocaleString(),
                        })}
                      </Tag>
                    )}
                  </div>
                  <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-muted-foreground">
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
      </Container>
    </section>
  );
}
