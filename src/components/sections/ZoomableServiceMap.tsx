"use client";

import {
  DEFAULT_MAP_POSITION,
  getServiceSlugByNumericId,
  isServiceNumericId,
  SERVICE_COUNTRY_ZOOM,
  type MapPosition,
} from "@/lib/images/world-map-countries";
import { cn } from "@/lib/utils";
import { geoCentroid } from "d3-geo";
import type { Feature, Geometry } from "geojson";
import { ComposableMap, Geographies, Geography, ZoomableGroup } from "react-simple-maps";
import worldTopology from "world-atlas/countries-110m.json";

export type { MapPosition };

interface ZoomableServiceMapProps {
  position: MapPosition;
  activeSlug: string | null;
  selectedSlug: string | null;
  onCountrySelect: (slug: string, position: MapPosition) => void;
  onCountryHover: (slug: string | null) => void;
  onReset: () => void;
}

const MAP_FILL = "color-mix(in oklch, var(--foreground) 6%, transparent)";
const MAP_STROKE = "color-mix(in oklch, var(--foreground) 10%, transparent)";
const SERVICE_FILL = "color-mix(in oklch, var(--primary) 20%, transparent)";
const SERVICE_STROKE = "color-mix(in oklch, var(--primary) 35%, transparent)";
const SERVICE_ACTIVE_FILL = "color-mix(in oklch, var(--primary) 48%, transparent)";
const SERVICE_SELECTED_FILL = "color-mix(in oklch, var(--primary) 55%, transparent)";

function countryFill(slug: string | null, activeSlug: string | null, selectedSlug: string | null) {
  if (slug && slug === selectedSlug) return SERVICE_SELECTED_FILL;
  if (slug && slug === activeSlug) return SERVICE_ACTIVE_FILL;
  if (slug) return SERVICE_FILL;
  return MAP_FILL;
}

export function ZoomableServiceMap({
  position,
  activeSlug,
  selectedSlug,
  onCountrySelect,
  onCountryHover,
  onReset,
}: ZoomableServiceMapProps) {
  const handleCountryClick = (geo: Feature<Geometry>) => {
    const slug = getServiceSlugByNumericId(geo.id as string);
    if (!slug) return;

    const centroid = geoCentroid(geo) as [number, number];
    onCountrySelect(slug, {
      coordinates: centroid,
      zoom: SERVICE_COUNTRY_ZOOM[slug] ?? 4,
    });
  };

  return (
    <ComposableMap
      projection="geoMercator"
      projectionConfig={{ scale: 140 }}
      className="h-full w-full"
      style={{ width: "100%", height: "100%" }}
      onClick={onReset}
    >
      <ZoomableGroup
        center={position.coordinates}
        zoom={position.zoom}
        minZoom={1}
        maxZoom={8}
        translateExtent={[
          [-1000, -500],
          [1000, 500],
        ]}
      >
        <Geographies geography={worldTopology}>
          {({ geographies }) =>
            geographies.map((geo) => {
              const slug = getServiceSlugByNumericId(geo.id as string);
              const isService = isServiceNumericId(geo.id as string);
              const isHighlighted =
                slug != null && (slug === activeSlug || slug === selectedSlug);

              return (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  tabIndex={isService ? 0 : -1}
                  role={isService ? "button" : undefined}
                  aria-label={isService ? geo.properties.name : undefined}
                  onClick={(event) => {
                    event.stopPropagation();
                    if (isService) handleCountryClick(geo);
                  }}
                  onKeyDown={(event) => {
                    if (!isService) return;
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      handleCountryClick(geo);
                    }
                  }}
                  onMouseEnter={() => {
                    if (slug) onCountryHover(slug);
                  }}
                  onMouseLeave={() => onCountryHover(null)}
                  className={cn(
                    "outline-none transition-[fill,stroke] duration-150",
                    isService && "cursor-pointer focus-visible:stroke-primary"
                  )}
                  style={{
                    default: {
                      fill: countryFill(slug, activeSlug, selectedSlug),
                      stroke: isService ? SERVICE_STROKE : MAP_STROKE,
                      strokeWidth: isHighlighted ? 1 : 0.4,
                      outline: "none",
                    },
                    hover: {
                      fill: isService
                        ? slug === selectedSlug
                          ? SERVICE_SELECTED_FILL
                          : SERVICE_ACTIVE_FILL
                        : MAP_FILL,
                      stroke: isService ? SERVICE_STROKE : MAP_STROKE,
                      strokeWidth: isHighlighted ? 1.2 : 0.4,
                      outline: "none",
                      cursor: isService ? "pointer" : "default",
                    },
                    pressed: {
                      fill: isService ? SERVICE_SELECTED_FILL : MAP_FILL,
                      stroke: isService ? SERVICE_STROKE : MAP_STROKE,
                      outline: "none",
                    },
                  }}
                />
              );
            })
          }
        </Geographies>
      </ZoomableGroup>
    </ComposableMap>
  );
}

export { DEFAULT_MAP_POSITION };
