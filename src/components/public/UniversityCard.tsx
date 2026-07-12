import { SurfaceCard } from "@/components/common/SurfaceCard";
import { ROUTES } from "@/constants";
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
}: UniversityCardProps) {
  return (
    <SurfaceCard href={`${ROUTES.universities}/${slug}`}>
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-12 items-center justify-center rounded-xl border bg-muted/50 text-sm font-bold text-primary">
          {monogram(name)}
        </span>
        {ranking && (
          <Tag className="gap-1">
            <HugeiconsIcon icon={StarIcon} className="size-3" />
            {ranking}
          </Tag>
        )}
      </div>
      <h3 className="mt-4 font-semibold leading-snug">{name}</h3>
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
    </SurfaceCard>
  );
}
