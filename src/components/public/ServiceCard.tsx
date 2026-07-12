import { IconBadge } from "@/components/common/IconBadge";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { ROUTES } from "@/constants";
import {
  ArrowRight01Icon,
  BookOpen01Icon,
  Briefcase01Icon,
  FileValidationIcon,
  Globe02Icon,
  GraduationScrollIcon,
  PassportIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon, type IconSvgElement } from "@hugeicons/react";

const SERVICE_ICONS: Record<string, IconSvgElement> = {
  "admission-processing": GraduationScrollIcon,
  "student-visa-support": PassportIcon,
  "sop-lor-guidance": FileValidationIcon,
  "scholarship-guidance": BookOpen01Icon,
  "pre-departure-support": Globe02Icon,
  "career-counseling": Briefcase01Icon,
};

interface ServiceCardProps {
  slug: string;
  title: string;
  description: string;
}

export function ServiceCard({ slug, title, description }: ServiceCardProps) {
  const icon = SERVICE_ICONS[slug] ?? Globe02Icon;
  return (
    <SurfaceCard href={`${ROUTES.services}/${slug}`}>
      <IconBadge icon={icon} tone="primary" />
      <h3 className="mt-4 font-semibold">{title}</h3>
      <p className="mt-2 flex-1 text-sm text-muted-foreground">{description}</p>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
        Learn more
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          className="size-4 transition-transform group-hover:translate-x-0.5"
        />
      </span>
    </SurfaceCard>
  );
}
