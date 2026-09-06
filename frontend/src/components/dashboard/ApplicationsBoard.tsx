import { APPLICATION_PHASES, statusLabel } from "@/lib/applications/phases";
import { cn } from "@/lib/utils";
import type { ApplicationStatus } from "@/types";
import { Tag } from "antd";

export interface BoardApplication {
  id: string;
  status: ApplicationStatus;
  universityName: string;
  countryName?: string;
  intake?: string | null;
}

interface ApplicationsBoardProps {
  applications: BoardApplication[];
  className?: string;
}

const PHASE_ACCENT: Record<string, string> = {
  prepare: "before:bg-blue-500",
  apply: "before:bg-indigo-500",
  offer: "before:bg-violet-500",
  visa: "before:bg-amber-500",
  departure: "before:bg-emerald-500",
};

/**
 * Kanban-style overview: every application sits in the column of its current
 * macro phase, giving students a bird's-eye view across all applications.
 */
export function ApplicationsBoard({
  applications,
  className,
}: ApplicationsBoardProps) {
  const rejected = applications.filter((a) => a.status === "rejected");
  const active = applications.filter((a) => a.status !== "rejected");

  return (
    <div className={cn("-mx-1 overflow-x-auto pb-2", className)}>
      <div className="flex min-w-max gap-3 px-1">
        {APPLICATION_PHASES.map((phase) => {
          const items = active.filter((a) =>
            phase.statuses.includes(a.status)
          );
          return (
            <div
              key={phase.key}
              className="flex w-64 shrink-0 flex-col rounded-xl border bg-muted/30"
            >
              <div
                className={cn(
                  "relative flex items-center justify-between gap-2 rounded-t-xl px-4 py-3 pl-5",
                  "before:absolute before:left-0 before:top-3 before:bottom-3 before:w-1 before:rounded-full",
                  PHASE_ACCENT[phase.key]
                )}
              >
                <p className="text-sm font-semibold">{phase.label}</p>
                <Tag>{items.length}</Tag>
              </div>
              <div className="flex flex-1 flex-col gap-2 p-3 pt-1">
                {items.length === 0 ? (
                  <p className="rounded-lg border border-dashed px-3 py-6 text-center text-xs text-muted-foreground">
                    Nothing here yet
                  </p>
                ) : (
                  items.map((app) => (
                    <div
                      key={app.id}
                      className="rounded-lg border bg-card p-3 shadow-sm transition-shadow hover:shadow-md"
                    >
                      <p className="text-sm font-medium leading-tight">
                        {app.universityName}
                      </p>
                      {app.countryName && (
                        <p className="text-xs text-muted-foreground">
                          {app.countryName}
                          {app.intake ? ` · ${app.intake}` : ""}
                        </p>
                      )}
                      <p className="mt-2 text-xs font-medium text-primary">
                        {statusLabel(app.status)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}

        {rejected.length > 0 && (
          <div className="flex w-64 shrink-0 flex-col rounded-xl border border-destructive/30 bg-destructive/5">
            <div className="flex items-center justify-between px-4 py-3">
              <p className="text-sm font-semibold text-destructive">
                Unsuccessful
              </p>
              <Tag color="red">{rejected.length}</Tag>
            </div>
            <div className="flex flex-col gap-2 p-3 pt-1">
              {rejected.map((app) => (
                <div
                  key={app.id}
                  className="rounded-lg border bg-card p-3 opacity-80"
                >
                  <p className="text-sm font-medium leading-tight">
                    {app.universityName}
                  </p>
                  {app.countryName && (
                    <p className="text-xs text-muted-foreground">
                      {app.countryName}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
