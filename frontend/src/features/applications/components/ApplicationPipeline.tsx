import {
  APPLICATION_PHASES,
  getPhaseState,
  overallProgress,
  phaseForStatus,
  statusLabel,
} from "@abroadly/shared/applications";
import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/types";
import {
  Alert02Icon,
  CheckmarkCircle02Icon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

interface ApplicationPipelineProps {
  currentStatus: ApplicationStatus;
  className?: string;
}

/**
 * Horizontal (desktop) / vertical (mobile) visual stepper for a single
 * application. Renders 5 macro phases with a connecting progress rail and the
 * exact sub-status highlighted underneath the active step.
 */
export function ApplicationPipeline({
  currentStatus,
  className,
}: ApplicationPipelineProps) {
  const isRejected = currentStatus === "rejected";
  const progress = overallProgress(currentStatus);
  const activePhase = phaseForStatus(currentStatus);

  if (isRejected) {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4",
          className
        )}
      >
        <div className="flex size-9 items-center justify-center rounded-full bg-destructive/10 text-destructive">
          <HugeiconsIcon icon={Alert02Icon} className="size-5" />
        </div>
        <div>
          <p className="text-sm font-semibold text-destructive">
            Application not successful
          </p>
          <p className="text-xs text-muted-foreground">
            Your counselor will reach out with next steps and alternatives.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-muted-foreground">
          Current step:{" "}
          <span className="text-foreground">{statusLabel(currentStatus)}</span>
        </span>
        <span className="font-semibold text-primary">{progress}% complete</span>
      </div>

      {/* Steps */}
      <ol className="flex flex-col gap-0 sm:flex-row sm:gap-2">
        {APPLICATION_PHASES.map((phase, index) => {
          const state = getPhaseState(phase, currentStatus);
          const isLast = index === APPLICATION_PHASES.length - 1;
          const isActive = phase.key === activePhase.key;

          return (
            <li
              key={phase.key}
              className="relative flex flex-1 gap-3 sm:flex-col sm:gap-0"
            >
              {/* Node + connector */}
              <div className="flex flex-col items-center sm:w-full sm:flex-row">
                <span
                  className={cn(
                    "z-10 flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-semibold transition-colors duration-300",
                    state === "complete" &&
                      "border-primary bg-primary text-primary-foreground",
                    state === "current" &&
                      "border-primary bg-primary/10 text-primary ring-4 ring-primary/10",
                    state === "upcoming" &&
                      "border-muted-foreground/30 bg-background text-muted-foreground"
                  )}
                >
                  {state === "complete" ? (
                    <HugeiconsIcon
                      icon={CheckmarkCircle02Icon}
                      className="size-4"
                    />
                  ) : (
                    index + 1
                  )}
                </span>
                {/* Horizontal connector (desktop) */}
                {!isLast && (
                  <span className="mx-2 hidden h-0.5 flex-1 overflow-hidden rounded-full bg-muted sm:block">
                    <span
                      className={cn(
                        "block h-full origin-left rounded-full bg-primary transition-transform duration-500",
                        state === "complete" ? "scale-x-100" : "scale-x-0"
                      )}
                    />
                  </span>
                )}
                {/* Vertical connector (mobile) */}
                {!isLast && (
                  <span
                    className={cn(
                      "my-1 w-0.5 flex-1 rounded-full sm:hidden",
                      state === "complete" ? "bg-primary" : "bg-muted"
                    )}
                  />
                )}
              </div>

              <div className="pb-4 sm:pb-0 sm:pt-3">
                <p
                  className={cn(
                    "text-sm font-medium leading-tight transition-colors",
                    state === "upcoming"
                      ? "text-muted-foreground"
                      : "text-foreground"
                  )}
                >
                  {phase.label}
                </p>
                {isActive && (
                  <p className="mt-0.5 text-xs font-medium text-primary">
                    {statusLabel(currentStatus)}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
