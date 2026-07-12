import { CoverImage } from "@/components/common/CoverImage";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { ROUTES } from "@/constants";
import { getUniversityImage } from "@/lib/images/public-assets";
import { Tag } from "antd";
import { ArrowRight01Icon, StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface UniversityCardProps {
  slug: string;
  name: string;
  city?: string | null;
  countryName?: string;
  ranking?: string | null;
  tuitionMin?: number | null;
  logoUrl?: string | null;
}

function monogram(name: string) {
  return name
    .split(/\s+/)
    .filter((w) => /[A-Za-z]/.test(w[0] ?? ""))
    .slice(0, 2)
    .map((w) => w[0]!.toUpperCase())
    .join("");
}

export function UniversityCard({
  slug,
  name,
  city,
  countryName,
  ranking,
  tuitionMin,
  logoUrl,
}: UniversityCardProps) {
  const imageSrc = getUniversityImage({ slug, logo_url: logoUrl });

  return (
    <SurfaceCard href={`${ROUTES.universities}/${slug}`} padding="none" className="overflow-hidden">
      <CoverImage
        src={imageSrc}
        alt={name}
        className="h-28"
        fallback={
          <span className="text-xl font-bold text-primary">{monogram(name)}</span>
        }
      />
      <div className="p-5">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-semibold leading-snug">{name}</h3>
          {ranking && (
            <Tag className="gap-1">
              <HugeiconsIcon icon={StarIcon} className="size-3" />
              {ranking}
            </Tag>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {[city, countryName].filter(Boolean).join(" · ")}
        </p>
        {tuitionMin && (
          <p className="mt-3 text-sm font-medium text-primary">
            From ${tuitionMin.toLocaleString()}/year
          </p>
        )}
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
          View university
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="size-4 transition-transform group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </SurfaceCard>
  );
}
