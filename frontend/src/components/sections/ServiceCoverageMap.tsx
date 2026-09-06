"use client";

import { ROUTES } from "@/constants";
import {
  DEFAULT_MAP_POSITION,
  getServiceCountryBySlug,
  getCountryMapPosition,
  SERVICE_COUNTRIES,
} from "@/lib/images/world-map-countries";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/navigation";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button } from "antd";
import dynamic from "next/dynamic";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import type { MapPosition } from "@/lib/images/world-map-countries";

const ZoomableServiceMap = dynamic(
  () =>
    import("@/components/sections/ZoomableServiceMap").then(
      (mod) => mod.ZoomableServiceMap
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex aspect-2/1 min-h-[220px] w-full items-center justify-center rounded-2xl bg-muted/30">
        <span className="text-sm text-muted-foreground">Loading map…</span>
      </div>
    ),
  }
);

interface ServiceCoverageMapProps {
  exploreLabel: string;
}

export function ServiceCoverageMap({ exploreLabel }: ServiceCoverageMapProps) {
  const t = useTranslations("home.serviceMap");
  const [position, setPosition] = useState<MapPosition>(DEFAULT_MAP_POSITION);
  const [activeSlug, setActiveSlug] = useState<string | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);

  const selectedCountry = selectedSlug
    ? getServiceCountryBySlug(selectedSlug)
    : undefined;

  const resetView = useCallback(() => {
    setPosition(DEFAULT_MAP_POSITION);
    setSelectedSlug(null);
  }, []);

  const zoomToCountry = useCallback((slug: string, nextPosition: MapPosition) => {
    setPosition(nextPosition);
    setSelectedSlug(slug);
  }, []);

  const handleSidebarClick = useCallback(
    (slug: string) => {
      zoomToCountry(slug, getCountryMapPosition(slug));
    },
    [zoomToCountry]
  );

  return (
    <div className="relative overflow-hidden rounded-3xl border bg-card/80 p-4 ring-1 ring-foreground/5 backdrop-blur-sm md:p-6">
      <div className="relative grid gap-6 lg:grid-cols-[1fr_220px]">
        <div className="relative aspect-2/1 min-h-[220px] w-full overflow-hidden rounded-2xl bg-muted/15">
          <div
            className="h-full w-full [&_svg]:h-full [&_svg]:w-full"
            aria-label="World map of study abroad destinations"
            role="application"
          >
            <ZoomableServiceMap
              position={position}
              activeSlug={activeSlug}
              selectedSlug={selectedSlug}
              onCountrySelect={zoomToCountry}
              onCountryHover={setActiveSlug}
              onReset={resetView}
            />
          </div>

          {selectedCountry && (
            <div
              className="absolute inset-x-3 bottom-3 flex flex-wrap items-center gap-3 rounded-2xl border bg-background/95 p-3 shadow-lg backdrop-blur-sm motion-safe:animate-fade-in-up sm:inset-x-auto sm:left-1/2 sm:max-w-md sm:-translate-x-1/2 sm:px-4"
              role="dialog"
              aria-label={t("exploreCountry", { country: selectedCountry.name })}
            >
              <span className="text-2xl" aria-hidden>
                {selectedCountry.flag}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-foreground">{selectedCountry.name}</p>
                <p className="text-xs text-muted-foreground">{t("studyOptions")}</p>
              </div>
              <div className="flex w-full flex-wrap gap-2 sm:w-auto">
                <Button size="small" onClick={resetView}>
                  {t("backToWorld")}
                </Button>
                <Link href={ROUTES.studyIn(selectedCountry.slug)}>
                  <Button type="primary" size="small" className="inline-flex items-center gap-1">
                    {exploreLabel}
                    <HugeiconsIcon icon={ArrowRight01Icon} className="size-3.5" />
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>

        <ul className="relative space-y-2 self-center">
          {SERVICE_COUNTRIES.map((country) => (
            <li key={country.slug}>
              <button
                type="button"
                onClick={() => handleSidebarClick(country.slug)}
                onMouseEnter={() => setActiveSlug(country.slug)}
                onMouseLeave={() => setActiveSlug(null)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl border bg-background/80 px-3 py-2.5 text-left text-sm transition-colors hover:border-primary/30 hover:bg-primary/5",
                  (activeSlug === country.slug || selectedSlug === country.slug) &&
                    "border-primary/40 bg-primary/5"
                )}
              >
                <span className="text-lg">{country.flag}</span>
                <span className="font-medium">{country.name}</span>
                <Link
                  href={ROUTES.studyIn(country.slug)}
                  className="ml-auto text-xs text-primary hover:underline"
                  onClick={(event) => event.stopPropagation()}
                >
                  {exploreLabel}
                </Link>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
