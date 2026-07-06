import {
  Analytics01Icon,
  ArrowRight01Icon,
  BookOpen01Icon,
  Briefcase01Icon,
  Calendar01Icon,
  CheckmarkCircle02Icon,
  DashboardSquare01Icon,
  File01Icon,
  FileValidationIcon,
  Globe02Icon,
  GraduationScrollIcon,
  HelpCircleIcon,
  Home01Icon,
  Message01Icon,
  Note01Icon,
  Notification01Icon,
  Settings01Icon,
  StarIcon,
  Task01Icon,
  UniversityIcon,
  UserAccountIcon,
  UserGroupIcon,
  UserMultiple02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import type { IconSvgElement } from "@hugeicons/react";

const NAV_ICON_MAP: Record<string, IconSvgElement> = {
  "/dashboard": DashboardSquare01Icon,
  "/dashboard/profile": UserAccountIcon,
  "/dashboard/applications": FileValidationIcon,
  "/dashboard/documents": File01Icon,
  "/dashboard/consultations": Calendar01Icon,
  "/dashboard/notifications": Notification01Icon,
  "/dashboard/settings": Settings01Icon,
  "/counselor": DashboardSquare01Icon,
  "/counselor/leads": UserMultiple02Icon,
  "/counselor/students": UserGroupIcon,
  "/counselor/applications": FileValidationIcon,
  "/counselor/tasks": Task01Icon,
  "/counselor/notes": Note01Icon,
  "/admin": DashboardSquare01Icon,
  "/admin/leads": UserMultiple02Icon,
  "/admin/students": UserGroupIcon,
  "/admin/applications": FileValidationIcon,
  "/admin/documents": File01Icon,
  "/admin/consultations": Calendar01Icon,
  "/admin/counselors": Briefcase01Icon,
  "/admin/users": UserAccountIcon,
  "/admin/countries": Globe02Icon,
  "/admin/universities": UniversityIcon,
  "/admin/courses": GraduationScrollIcon,
  "/admin/scholarships": StarIcon,
  "/admin/blog": BookOpen01Icon,
  "/admin/faqs": HelpCircleIcon,
  "/admin/testimonials": Message01Icon,
  "/admin/settings": Settings01Icon,
};

export function NavIcon({
  href,
  className = "size-4",
}: {
  href: string;
  className?: string;
}) {
  const icon = NAV_ICON_MAP[href] ?? Home01Icon;
  return <HugeiconsIcon icon={icon} className={className} strokeWidth={1.75} />;
}

export function StatIcon({
  icon,
  className = "size-5",
}: {
  icon: IconSvgElement;
  className?: string;
}) {
  return <HugeiconsIcon icon={icon} className={className} strokeWidth={1.75} />;
}

export {
  Analytics01Icon,
  ArrowRight01Icon,
  BookOpen01Icon,
  Briefcase01Icon,
  Calendar01Icon,
  CheckmarkCircle02Icon,
  DashboardSquare01Icon,
  File01Icon,
  FileValidationIcon,
  Globe02Icon,
  GraduationScrollIcon,
  HelpCircleIcon,
  Message01Icon,
  Notification01Icon,
  Settings01Icon,
  StarIcon,
  Task01Icon,
  UniversityIcon,
  UserAccountIcon,
  UserGroupIcon,
  UserMultiple02Icon,
};
