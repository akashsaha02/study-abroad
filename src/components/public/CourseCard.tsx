import { Badge } from "@/components/ui/badge";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { ROUTES } from "@/constants";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface CourseCardProps {
  slug: string;
  title: string;
  universityName?: string;
  countryName?: string;
  degreeLevel?: string | null;
  subjectArea?: string | null;
  tuitionFee?: number | null;
}

export function CourseCard({
  slug,
  title,
  universityName,
  countryName,
  degreeLevel,
  subjectArea,
  tuitionFee,
}: CourseCardProps) {
  return (
    <SurfaceCard href={`${ROUTES.courses}/${slug}`}>
      <div className="flex flex-wrap gap-1.5">
        {degreeLevel && <Badge variant="outline">{degreeLevel}</Badge>}
        {subjectArea && <Badge variant="outline">{subjectArea}</Badge>}
      </div>
      <h3 className="mt-3 font-semibold leading-snug">{title}</h3>
      <p className="text-sm text-muted-foreground">
        {universityName}
        {countryName ? ` · ${countryName}` : ""}
      </p>
      {tuitionFee && (
        <p className="mt-3 text-sm font-semibold text-primary">
          ${tuitionFee.toLocaleString()}/year
        </p>
      )}
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
        View course
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          className="size-4 transition-transform group-hover:translate-x-0.5"
        />
      </span>
    </SurfaceCard>
  );
}
