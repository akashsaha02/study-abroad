import { SectionHeader } from "@/components/common/SectionHeader";
import { Badge } from "@/components/ui/badge";
import { POPULAR_COUNTRIES, ROUTES } from "@/constants";
import type { Country } from "@/types";
import { ArrowRight01Icon, Globe02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import Link from "next/link";
import { Section } from "../common/Section";

interface PopularDestinationsProps {
  countries: Partial<Country>[];
}

// Map country slug -> flag emoji for a lightweight visual cue.
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

export function PopularDestinations({ countries }: PopularDestinationsProps) {
  return (
    <Section>
      <SectionHeader
        eyebrow="Destinations"
        eyebrowIcon={Globe02Icon}
        title="Popular study destinations"
        description="Explore top countries for international students, with transparent tuition and living costs."
      />
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {countries.map((country, i) => {
          const flag = country.slug ? FLAG_BY_SLUG[country.slug] : undefined;
          return (
            <Link
              key={country.slug}
              href={ROUTES.studyIn(country.slug!)}
              className="group relative flex flex-col overflow-hidden rounded-2xl border bg-card ring-1 ring-foreground/5 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`relative flex h-28 items-center justify-center bg-linear-to-br ${
                  GRADIENTS[i % GRADIENTS.length]
                }`}
              >
                <span className="text-5xl drop-shadow-sm" aria-hidden>
                  {flag ?? "🌍"}
                </span>
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-semibold">{country.name}</h3>
                  {country.tuition_min && (
                    <Badge variant="outline" className="shrink-0">
                      From ${country.tuition_min.toLocaleString()}/yr
                    </Badge>
                  )}
                </div>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {country.description}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Explore
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
