"use client";

import { EmptyState } from "@/components/common/EmptyState";
import { ProgramCard } from "@/components/programs/ProgramCard";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { AppSelect } from "@/components/common/AppSelect";
import { cn } from "@/lib/utils";
import {
  DEFAULT_MATCH_PROFILE,
  DEGREE_LEVELS,
  INTAKE_SEASONS,
  SAMPLE_PROGRAMS,
  computeMatchScore,
  type DegreeLevel,
  type IntakeSeason,
  type Program,
  type StudentMatchProfile,
} from "@/data/programs";
import {
  Cancel01Icon,
  FilterHorizontalIcon,
  Search01Icon,
  SparklesIcon,
} from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Button, Drawer, Tag } from "antd";
import { useMemo, useState } from "react";

type SortKey = "match" | "tuition-asc" | "tuition-desc" | "ranking";

interface FilterState {
  search: string;
  countries: string[];
  degreeLevels: DegreeLevel[];
  maxBudget: number;
  minIelts: number;
  intakes: IntakeSeason[];
}

const BUDGET_MAX = 55000;

const INITIAL_FILTERS: FilterState = {
  search: "",
  countries: [],
  degreeLevels: [],
  maxBudget: BUDGET_MAX,
  minIelts: 0,
  intakes: [],
};

function toggle<T>(list: T[], value: T): T[] {
  return list.includes(value)
    ? list.filter((v) => v !== value)
    : [...list, value];
}

function usd(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

interface ProgramFinderProps {
  programs?: Program[];
}

export function ProgramFinder({ programs = SAMPLE_PROGRAMS }: ProgramFinderProps) {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [sort, setSort] = useState<SortKey>("match");
  const [profile, setProfile] = useState<StudentMatchProfile>(
    DEFAULT_MATCH_PROFILE
  );
  const [mobileOpen, setMobileOpen] = useState(false);

  const allCountries = useMemo(
    () =>
      Array.from(new Set(programs.map((p) => p.country))).sort((a, b) =>
        a.localeCompare(b)
      ),
    [programs]
  );

  const results = useMemo(() => {
    const scored = programs
      .filter((p) => {
        if (
          filters.search &&
          !`${p.name} ${p.university} ${p.subjectArea}`
            .toLowerCase()
            .includes(filters.search.toLowerCase())
        )
          return false;
        if (filters.countries.length && !filters.countries.includes(p.country))
          return false;
        if (
          filters.degreeLevels.length &&
          !filters.degreeLevels.includes(p.degreeLevel)
        )
          return false;
        if (p.tuitionUsd > filters.maxBudget) return false;
        if (p.ieltsRequired < filters.minIelts) return false;
        if (
          filters.intakes.length &&
          !p.intakes.some((i) => filters.intakes.includes(i))
        )
          return false;
        return true;
      })
      .map((p) => ({ program: p, score: computeMatchScore(p, profile) }));

    scored.sort((a, b) => {
      switch (sort) {
        case "tuition-asc":
          return a.program.tuitionUsd - b.program.tuitionUsd;
        case "tuition-desc":
          return b.program.tuitionUsd - a.program.tuitionUsd;
        case "ranking":
          return (a.program.ranking ?? 9999) - (b.program.ranking ?? 9999);
        default:
          return b.score - a.score;
      }
    });
    return scored;
  }, [programs, filters, sort, profile]);

  const activeFilterCount =
    filters.countries.length +
    filters.degreeLevels.length +
    filters.intakes.length +
    (filters.maxBudget < BUDGET_MAX ? 1 : 0) +
    (filters.minIelts > 0 ? 1 : 0) +
    (filters.search ? 1 : 0);

  const filterPanel = (
    <FilterPanel
      filters={filters}
      setFilters={setFilters}
      profile={profile}
      setProfile={setProfile}
      allCountries={allCountries}
    />
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
      {/* Desktop sidebar */}
      <aside className="hidden lg:block">
        <SurfaceCard
          hover={false}
          padding="lg"
          className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto"
        >
          {filterPanel}
        </SurfaceCard>
      </aside>

      <div className="min-w-0">
        {/* Toolbar */}
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <HugeiconsIcon
              icon={Search01Icon}
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="search"
              value={filters.search}
              onChange={(e) =>
                setFilters((f) => ({ ...f, search: e.target.value }))
              }
              placeholder="Search programs or universities"
              className="h-9 w-full rounded-4xl border border-input bg-transparent pl-9 pr-3 text-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
            />
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="small"
              className="lg:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <HugeiconsIcon
                icon={FilterHorizontalIcon}
                className="size-4"
                data-icon="inline-start"
              />
              Filters
              {activeFilterCount > 0 && (
                <Tag className="ml-1">{activeFilterCount}</Tag>
              )}
            </Button>
            <Drawer
              title="Filters"
              placement="left"
              open={mobileOpen}
              onClose={() => setMobileOpen(false)}
              size={300}
              className="overflow-y-auto"
            >
              {filterPanel}
            </Drawer>

            <label htmlFor="sort" className="sr-only">
              Sort programs
            </label>
            <AppSelect
              id="sort"
              value={sort}
              onChange={(value) => setSort(value as SortKey)}
              size="middle"
              className="min-w-[180px]"
              allowClear={false}
              options={[
                { value: "match", label: "Best match" },
                { value: "tuition-asc", label: "Tuition: low to high" },
                { value: "tuition-desc", label: "Tuition: high to low" },
                { value: "ranking", label: "World ranking" },
              ]}
            />
          </div>
        </div>

        <p className="mb-4 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{results.length}</span>{" "}
          {results.length === 1 ? "program" : "programs"} found
          {activeFilterCount > 0 && (
            <button
              type="button"
              onClick={() => setFilters(INITIAL_FILTERS)}
              className="ml-3 inline-flex items-center gap-1 text-primary hover:underline"
            >
              <HugeiconsIcon icon={Cancel01Icon} className="size-3.5" />
              Clear filters
            </button>
          )}
        </p>

        {results.length === 0 ? (
          <EmptyState
            title="No programs match your filters"
            description="Try widening your budget, lowering the IELTS requirement, or clearing a country filter."
            icon={<HugeiconsIcon icon={Search01Icon} className="size-10 opacity-80" />}
          />
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {results.map(({ program, score }) => (
              <ProgramCard key={program.id} program={program} matchScore={score} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

interface FilterPanelProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  profile: StudentMatchProfile;
  setProfile: React.Dispatch<React.SetStateAction<StudentMatchProfile>>;
  allCountries: string[];
}

function FilterPanel({
  filters,
  setFilters,
  profile,
  setProfile,
  allCountries,
}: FilterPanelProps) {
  return (
    <div className="space-y-6">
      <section className="rounded-lg border border-primary/20 bg-primary/5 p-4">
        <h3 className="flex items-center gap-1.5 text-sm font-semibold">
          <HugeiconsIcon icon={SparklesIcon} className="size-4 text-primary" />
          Your match profile
        </h3>
        <p className="mt-1 text-xs text-muted-foreground">
          Tune these to recalculate every Match Score.
        </p>
        <div className="mt-3 space-y-3">
          <RangeField
            label="Your IELTS score"
            value={profile.ieltsScore}
            min={4}
            max={9}
            step={0.5}
            display={profile.ieltsScore.toFixed(1)}
            onChange={(v) => setProfile((p) => ({ ...p, ieltsScore: v }))}
          />
          <RangeField
            label="Budget ceiling"
            value={profile.maxBudgetUsd}
            min={5000}
            max={BUDGET_MAX}
            step={1000}
            display={usd(profile.maxBudgetUsd)}
            onChange={(v) => setProfile((p) => ({ ...p, maxBudgetUsd: v }))}
          />
        </div>
      </section>

      <FilterGroup label="Country">
        <div className="max-h-48 space-y-1 overflow-y-auto pr-1">
          {allCountries.map((country) => (
            <CheckRow
              key={country}
              label={country}
              checked={filters.countries.includes(country)}
              onChange={() =>
                setFilters((f) => ({
                  ...f,
                  countries: toggle(f.countries, country),
                }))
              }
            />
          ))}
        </div>
      </FilterGroup>

      <FilterGroup label="Degree level">
        {DEGREE_LEVELS.map((level) => (
          <CheckRow
            key={level}
            label={level}
            checked={filters.degreeLevels.includes(level)}
            onChange={() =>
              setFilters((f) => ({
                ...f,
                degreeLevels: toggle(f.degreeLevels, level),
              }))
            }
          />
        ))}
      </FilterGroup>

      <FilterGroup label={`Max tuition · ${usd(filters.maxBudget)}`}>
        <input
          type="range"
          min={5000}
          max={BUDGET_MAX}
          step={1000}
          value={filters.maxBudget}
          onChange={(e) =>
            setFilters((f) => ({ ...f, maxBudget: Number(e.target.value) }))
          }
          className="w-full accent-primary"
          aria-label="Maximum tuition"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>$5k</span>
          <span>${BUDGET_MAX / 1000}k</span>
        </div>
      </FilterGroup>

      <FilterGroup
        label={`Min IELTS accepted · ${
          filters.minIelts === 0 ? "Any" : filters.minIelts.toFixed(1)
        }`}
      >
        <input
          type="range"
          min={0}
          max={8}
          step={0.5}
          value={filters.minIelts}
          onChange={(e) =>
            setFilters((f) => ({ ...f, minIelts: Number(e.target.value) }))
          }
          className="w-full accent-primary"
          aria-label="Minimum IELTS requirement"
        />
        <p className="text-xs text-muted-foreground">
          Show programs requiring at least this band.
        </p>
      </FilterGroup>

      <FilterGroup label="Intake season">
        <div className="flex flex-wrap gap-2">
          {INTAKE_SEASONS.map((season) => {
            const active = filters.intakes.includes(season);
            return (
              <button
                key={season}
                type="button"
                onClick={() =>
                  setFilters((f) => ({
                    ...f,
                    intakes: toggle(f.intakes, season),
                  }))
                }
                className={cn(
                  "rounded-4xl border px-3 py-1 text-xs font-medium transition-colors",
                  active
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input text-muted-foreground hover:bg-muted"
                )}
                aria-pressed={active}
              >
                {season}
              </button>
            );
          })}
        </div>
      </FilterGroup>
    </div>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-sm font-semibold">{label}</p>
      {children}
    </div>
  );
}

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-2 rounded-md px-1 py-1 text-sm transition-colors hover:bg-muted/60">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="size-4 accent-primary"
      />
      <span>{label}</span>
    </label>
  );
}

function RangeField({
  label,
  value,
  min,
  max,
  step,
  display,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  display: string;
  onChange: (v: number) => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold">{display}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-1 w-full accent-primary"
        aria-label={label}
      />
    </div>
  );
}
