"use client";

import { EmptyState } from "@/components/common/EmptyState";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import {
  activeMetrics,
  bestForMetric,
  type CompareUniversity,
} from "@/data/compare";
import { cn } from "@/lib/utils";
import {
  Add01Icon,
  Cancel01Icon,
  CheckmarkCircle02Icon,
  UniversityIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, Tag } from "antd";
import { useMemo, useState } from "react";

const MAX_COMPARE = 3;

interface ComparisonMatrixProps {
  universities: CompareUniversity[];
}

export function ComparisonMatrix({ universities }: ComparisonMatrixProps) {
  const defaultIds = universities.slice(0, 2).map((u) => u.id);
  const [selectedIds, setSelectedIds] = useState<string[]>(defaultIds);
  const [pickerOpen, setPickerOpen] = useState(false);

  const selected = useMemo(
    () =>
      selectedIds
        .map((id) => universities.find((u) => u.id === id))
        .filter(Boolean) as CompareUniversity[],
    [selectedIds, universities]
  );

  const available = universities.filter((u) => !selectedIds.includes(u.id));

  const metrics = useMemo(() => activeMetrics(selected), [selected]);

  const bestByMetric = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const metric of metrics) {
      map[metric.key] = bestForMetric(metric, selected);
    }
    return map;
  }, [metrics, selected]);

  function addUniversity(id: string) {
    setSelectedIds((ids) =>
      ids.length < MAX_COMPARE ? [...ids, id] : ids
    );
    setPickerOpen(false);
  }

  function removeUniversity(id: string) {
    setSelectedIds((ids) => ids.filter((x) => x !== id));
  }

  const canAdd = selected.length < MAX_COMPARE;

  if (universities.length === 0) {
    return (
      <EmptyState
        title="No universities to compare"
        description="Publish universities in the admin panel to enable side-by-side comparison."
        icon={<HugeiconsIcon icon={UniversityIcon} className="size-10 opacity-80" />}
      />
    );
  }

  if (selected.length === 0) {
    return (
      <div className="space-y-4">
        <EmptyState
          title="Start comparing universities"
          description="Add up to 3 universities to see a side-by-side breakdown of tuition, ranking, and living costs."
          icon={
            <HugeiconsIcon icon={UniversityIcon} className="size-10 opacity-80" />
          }
        />
        <UniversityPicker available={universities} onPick={addUniversity} />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <SurfaceCard hover={false} padding="none" className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-sm">
          <thead>
            <tr>
              <th className="w-44 border-b border-r bg-muted/40 p-4 text-left align-bottom text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Metric
              </th>
              {selected.map((uni) => (
                <th
                  key={uni.id}
                  className="border-b border-r p-4 text-left align-top last:border-r-0"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="flex size-9 items-center justify-center rounded-lg border bg-muted/50 text-xs font-bold text-primary">
                        {uni.short}
                      </span>
                      <div>
                        <p className="font-semibold leading-tight">{uni.name}</p>
                        <p className="text-xs font-normal text-muted-foreground">
                          {uni.countryFlag} {uni.city}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeUniversity(uni.id)}
                      className="rounded-md p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      aria-label={`Remove ${uni.name}`}
                    >
                      <HugeiconsIcon icon={Cancel01Icon} className="size-4" />
                    </button>
                  </div>
                </th>
              ))}
              {canAdd && (
                <th className="border-b p-4 align-middle">
                  <AddColumn
                    open={pickerOpen}
                    setOpen={setPickerOpen}
                    available={available}
                    onPick={addUniversity}
                  />
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {metrics.map((metric, rowIdx) => (
              <tr
                key={metric.key}
                className={cn(rowIdx % 2 === 1 && "bg-muted/20")}
              >
                <th className="border-r bg-muted/40 p-4 text-left align-top font-medium">
                  {metric.label}
                  {metric.hint && (
                    <span className="mt-0.5 block text-xs font-normal text-muted-foreground">
                      {metric.hint}
                    </span>
                  )}
                </th>
                {selected.map((uni) => {
                  const value = uni[metric.key];
                  const isBest = bestByMetric[metric.key]?.includes(uni.id);
                  const display =
                    typeof value === "number" && value > 0
                      ? metric.format(value)
                      : "—";
                  return (
                    <td
                      key={uni.id}
                      className="border-r p-4 align-top last:border-r-0"
                    >
                      <span
                        className={cn(
                          "inline-flex items-center gap-1.5 font-semibold",
                          isBest && "text-emerald-600 dark:text-emerald-400"
                        )}
                      >
                        {display}
                        {isBest && (
                          <HugeiconsIcon
                            icon={CheckmarkCircle02Icon}
                            className="size-4"
                          />
                        )}
                      </span>
                      {isBest && (
                        <span className="mt-1 block">
                          <Tag className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                            Best
                          </Tag>
                        </span>
                      )}
                    </td>
                  );
                })}
                {canAdd && <td className="p-4" />}
              </tr>
            ))}
          </tbody>
        </table>
      </SurfaceCard>

      <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
        <HugeiconsIcon
          icon={CheckmarkCircle02Icon}
          className="size-4 text-emerald-600"
        />
        Green highlights the best value for each metric across your selection.
      </div>
    </div>
  );
}

function AddColumn({
  open,
  setOpen,
  available,
  onPick,
}: {
  open: boolean;
  setOpen: (v: boolean) => void;
  available: CompareUniversity[];
  onPick: (id: string) => void;
}) {
  return (
    <div className="relative">
      <Button
        size="small"
        onClick={() => setOpen(!open)}
        disabled={available.length === 0}
        aria-expanded={open}
      >
        <HugeiconsIcon icon={Add01Icon} className="size-4" data-icon="inline-start" />
        Add
      </Button>
      {open && available.length > 0 && (
        <div className="absolute right-0 z-20 mt-2 w-60 rounded-xl border bg-popover p-1.5 shadow-lg">
          <p className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            Add a university
          </p>
          <div className="max-h-64 overflow-y-auto">
            {available.map((uni) => (
              <button
                key={uni.id}
                type="button"
                onClick={() => onPick(uni.id)}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm transition-colors hover:bg-muted"
              >
                <span className="flex size-7 items-center justify-center rounded-md border bg-muted/50 text-[10px] font-bold text-primary">
                  {uni.short}
                </span>
                <span className="min-w-0">
                  <span className="block truncate font-medium">{uni.name}</span>
                  <span className="block text-xs text-muted-foreground">
                    {uni.countryFlag} {uni.country}
                  </span>
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function UniversityPicker({
  available,
  onPick,
}: {
  available: CompareUniversity[];
  onPick: (id: string) => void;
}) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {available.map((uni) => (
        <button
          key={uni.id}
          type="button"
          onClick={() => onPick(uni.id)}
          className="flex items-center gap-3 rounded-2xl border bg-card p-4 text-left ring-1 ring-foreground/5 transition-all hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg"
        >
          <span className="flex size-10 items-center justify-center rounded-lg border bg-muted/50 text-xs font-bold text-primary">
            {uni.short}
          </span>
          <span className="min-w-0">
            <span className="block truncate font-medium">{uni.name}</span>
            <span className="block text-xs text-muted-foreground">
              {uni.countryFlag} {uni.city}, {uni.country}
            </span>
          </span>
        </button>
      ))}
    </div>
  );
}
