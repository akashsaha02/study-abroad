import { Badge as UIBadge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type {
  ApplicationStatus,
  DocumentStatus,
  LeadStatus,
} from "@/types";

const statusVariants: Record<string, string> = {
  new: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  contacted: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  qualified: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  not_qualified: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  converted_to_student: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  lost: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
  pending_review: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  approved: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
  needs_update: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  profile_review: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
};

interface StatusBadgeProps {
  status: LeadStatus | ApplicationStatus | DocumentStatus | string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const label = status.replace(/_/g, " ");
  return (
    <UIBadge
      variant="secondary"
      className={cn(
        "capitalize",
        statusVariants[status] ?? "",
        className
      )}
    >
      {label}
    </UIBadge>
  );
}
