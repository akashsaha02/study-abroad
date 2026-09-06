import { APPLICATION_STATUSES, APPLICATION_STATUS_LABELS } from "@/constants";
import type { ApplicationStatus } from "@/types";

export interface ApplicationPhase {
  key: string;
  label: string;
  statuses: ApplicationStatus[];
}

/**
 * Groups the 11 granular application statuses into 5 human-friendly macro
 * phases so students see a clean, scannable pipeline instead of a long list.
 */
export const APPLICATION_PHASES: ApplicationPhase[] = [
  {
    key: "prepare",
    label: "Profile & Documents",
    statuses: ["profile_review", "documents_pending"],
  },
  {
    key: "apply",
    label: "Shortlist & Apply",
    statuses: ["university_shortlisting", "application_submitted"],
  },
  {
    key: "offer",
    label: "Offer & Payment",
    statuses: ["offer_received", "tuition_payment"],
  },
  {
    key: "visa",
    label: "Visa Processing",
    statuses: ["visa_documents", "visa_submitted", "visa_approved"],
  },
  {
    key: "departure",
    label: "Pre-departure",
    statuses: ["pre_departure", "completed"],
  },
];

export type PhaseState = "complete" | "current" | "upcoming" | "rejected";

export function statusLabel(status: ApplicationStatus): string {
  return APPLICATION_STATUS_LABELS[status] ?? status;
}

export function phaseForStatus(status: ApplicationStatus): ApplicationPhase {
  return (
    APPLICATION_PHASES.find((p) => p.statuses.includes(status)) ??
    APPLICATION_PHASES[0]
  );
}

/** Returns 0-100 overall completion for a given status. */
export function overallProgress(status: ApplicationStatus): number {
  if (status === "rejected") return 0;
  const order: ApplicationStatus[] = APPLICATION_STATUSES.filter(
    (s) => s !== "rejected"
  );
  const idx = order.indexOf(status);
  if (idx < 0) return 0;
  return Math.round(((idx + 1) / order.length) * 100);
}

export function getPhaseState(
  phase: ApplicationPhase,
  currentStatus: ApplicationStatus
): PhaseState {
  if (currentStatus === "rejected") return "rejected";
  const order: ApplicationStatus[] = APPLICATION_STATUSES.filter(
    (s) => s !== "rejected"
  );
  const currentIdx = order.indexOf(currentStatus);
  const phaseIdxs = phase.statuses
    .map((s) => order.indexOf(s))
    .filter((i) => i >= 0);
  const phaseStart = Math.min(...phaseIdxs);
  const phaseEnd = Math.max(...phaseIdxs);

  if (currentIdx > phaseEnd) return "complete";
  if (currentIdx >= phaseStart && currentIdx <= phaseEnd) return "current";
  return "upcoming";
}
