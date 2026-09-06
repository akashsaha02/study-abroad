import { SurfaceCard } from "@/components/common/SurfaceCard";
import { Tag } from "antd";import { Calendar01Icon, StarIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface ScholarshipCardProps {
  title: string;
  amount?: string | null;
  location?: string;
  deadline?: string | null;
}

export function ScholarshipCard({
  title,
  amount,
  location,
  deadline,
}: ScholarshipCardProps) {
  return (
    <SurfaceCard hover={false} variant="glass">
      <div className="flex items-start justify-between gap-3">
        <span className="flex size-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">
          <HugeiconsIcon icon={StarIcon} className="size-5" />
        </span>
        {amount && (
          <Tag className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
            {amount}
          </Tag>
        )}
      </div>
      <h3 className="mt-4 font-semibold leading-snug">{title}</h3>
      {location && (
        <p className="mt-1 text-sm text-muted-foreground">{location}</p>
      )}
      {deadline && (
        <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
          <HugeiconsIcon icon={Calendar01Icon} className="size-3.5" />
          Deadline: {deadline}
        </p>
      )}
    </SurfaceCard>
  );
}
