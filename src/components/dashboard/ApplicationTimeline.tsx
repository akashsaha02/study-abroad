import { APPLICATION_STATUSES, APPLICATION_STATUS_LABELS } from "@/constants";
import type { ApplicationStatus } from "@/types";
import { cn } from "@/lib/utils";

interface ApplicationTimelineProps {
  currentStatus: ApplicationStatus;
  className?: string;
}

export function ApplicationTimeline({
  currentStatus,
  className,
}: ApplicationTimelineProps) {
  const currentIndex = APPLICATION_STATUSES.indexOf(currentStatus);
  const isRejected = currentStatus === "rejected";

  const steps = APPLICATION_STATUSES.filter((s) => s !== "rejected");

  return (
    <div className={cn("space-y-0", className)}>
      {steps.map((status, index) => {
        const isComplete = !isRejected && index < currentIndex;
        const isCurrent = status === currentStatus;
        const isPending = !isRejected && index > currentIndex;

        return (
          <div key={status} className="flex gap-4">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border-2 text-xs font-medium",
                  isComplete && "border-primary bg-primary text-primary-foreground",
                  isCurrent && "border-primary bg-primary/10 text-primary",
                  isPending && "border-muted-foreground/30 text-muted-foreground",
                  isRejected && "border-muted-foreground/30 text-muted-foreground"
                )}
              >
                {isComplete ? "✓" : index + 1}
              </div>
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "h-8 w-0.5",
                    isComplete ? "bg-primary" : "bg-muted-foreground/20"
                  )}
                />
              )}
            </div>
            <div className="pb-8">
              <p
                className={cn(
                  "text-sm font-medium",
                  isCurrent && "text-primary",
                  isPending && "text-muted-foreground"
                )}
              >
                {APPLICATION_STATUS_LABELS[status]}
              </p>
            </div>
          </div>
        );
      })}
      {isRejected && (
        <p className="text-sm font-medium text-destructive">Application Rejected</p>
      )}
    </div>
  );
}
