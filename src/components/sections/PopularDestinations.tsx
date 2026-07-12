import { SectionHeader } from "@/components/common/SectionHeader";
import { POPULAR_COUNTRIES, ROUTES } from "@/constants";
import { Link } from "@/i18n/navigation";
import { getLocalizedCountryDescription } from "@/lib/fallback-i18n";
import type { Country } from "@/types";
import { ArrowRight01Icon, Globe02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Tag } from "antd";
import { getTranslations } from "next-intl/server";
import { Section } from "../common/Section";

interface PopularDestinationsProps {
  countries: Partial<Country>[];
  useFallbackDescriptions?: boolean;
}

const FLAG_BY_SLUG: Record<string, string> = Object.fromEntries(
  POPULAR_COUNTRIES.map((c) => [c.slug, c.flag])
);

const GRADIENTS = [
  "from-sky-500/20 to-indigo-500/20",
  "from-emerald-500/20 to-teal-500/20",
  "from-violet-500/20 to-fuchsia-500/20",
  "from-amber-500/20 to-orange-500/20",
  "from-rose-500/20 to-pink-500/20",
  "from-cyan-500/20 to-blue-500/20",
];

export async function PopularDestinations({
  countries,
  useFallbackDescriptions = false,
}: PopularDestinationsProps) {
  const t = await getTranslations("home.destinations");
  const tCountries = await getTranslations("fallback.countries");

  return (
    <Section>
      <SectionHeader
        eyebrow={t("eyebrow")}
        eyebrowIcon={Globe02Icon}
        title={t("title")}
        description={t("description")}
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((country, i) => {
          const flag = country.slug ? FLAG_BY_SLUG[country.slug] : undefined;
          const description = useFallbackDescriptions
            ? getLocalizedCountryDescription(
                country.slug,
                (key) => tCountries(key as "uk" | "canada" | "australia" | "usa" | "malaysia" | "germany"),
                country.description
              )
            : country.description;
          return (
            <Link
              key={country.slug}
              href={ROUTES.studyIn(country.slug!)}
              className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card ring-1 ring-foreground/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`relative flex h-24 items-center justify-center bg-linear-to-br ${
                  GRADIENTS[i % GRADIENTS.length]
                }`}
              >
                <span className="text-4xl drop-shadow-sm" aria-hidden>
                  {flag ?? "🌍"}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold">{country.name}</h3>
                  {country.tuition_min && (
                    <Tag className="shrink-0">
                      {t("fromPerYear", {
                        price: country.tuition_min.toLocaleString(),
                      })}
                    </Tag>
                  )}
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
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
    </Section>
  );
}
