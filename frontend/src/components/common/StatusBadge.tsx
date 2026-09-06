import { Tag } from "antd";
import { cn } from "@/lib/utils";
import type {
  ApplicationStatus,
  DocumentStatus,
  LeadStatus,
} from "@/types";

const statusColors: Record<string, string> = {
  new: "blue",
  contacted: "gold",
  qualified: "green",
  not_qualified: "red",
  converted_to_student: "purple",
  lost: "default",
  pending_review: "gold",
  approved: "green",
  rejected: "red",
  needs_update: "orange",
  profile_review: "blue",
  completed: "green",
  documents_pending: "gold",
  university_shortlisting: "cyan",
  application_submitted: "blue",
  offer_received: "green",
  tuition_payment: "purple",
  visa_documents: "orange",
  visa_submitted: "blue",
  visa_approved: "green",
  pre_departure: "cyan",
  requested: "blue",
  scheduled: "gold",
  cancelled: "red",
};

interface StatusBadgeProps {
  status: LeadStatus | ApplicationStatus | DocumentStatus | string;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <Tag color={statusColors[status] ?? "default"} className={cn(className)}>
      {label ?? status.replace(/_/g, " ")}
    </Tag>
  );
}
