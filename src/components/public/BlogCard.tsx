import { SurfaceCard } from "@/components/common/SurfaceCard";
import { ROUTES } from "@/constants";
import { ArrowRight01Icon, BookOpen01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface BlogCardProps {
  slug: string;
  title: string;
  excerpt?: string | null;
}

export function BlogCard({ slug, title, excerpt }: BlogCardProps) {
  return (
    <SurfaceCard href={`${ROUTES.blog}/${slug}`}>
      <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
        <HugeiconsIcon icon={BookOpen01Icon} className="size-5" />
      </span>
      <h3 className="mt-4 font-semibold leading-snug">{title}</h3>
      {excerpt && (
        <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
          {excerpt}
        </p>
      )}
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
        Read article
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          className="size-4 transition-transform group-hover:translate-x-0.5"
        />
      </span>
    </SurfaceCard>
  );
}
