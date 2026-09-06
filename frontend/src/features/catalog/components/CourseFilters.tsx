"use client";

import { AppSelect } from "@/components/common/AppSelect";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

interface CountryOption {
  id: string;
  name: string;
}

interface CourseFiltersProps {
  countries: CountryOption[];
  degreeLevels: string[];
}

export function CourseFilters({ countries, degreeLevels }: CourseFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const countryId = searchParams.get("country") ?? "";
  const degreeLevel = searchParams.get("degree") ?? "";

  const updateFilter = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) params.set(key, value);
      else params.delete(key);
      router.push(`/courses?${params.toString()}`);
    },
    [router, searchParams]
  );

  return (
    <SurfaceCard hover={false} className="mb-8 flex flex-wrap gap-4">
      <div className="min-w-[200px] flex-1">
        <label htmlFor="filter-country" className="text-sm font-medium">
          Country
        </label>
        <AppSelect
          id="filter-country"
          className="mt-1.5"
          value={countryId}
          onChange={(value) => updateFilter("country", value)}
          placeholder="All countries"
          showSearch
          options={countries.map((c) => ({ value: c.id, label: c.name }))}
        />
      </div>
      <div className="min-w-[200px] flex-1">
        <label htmlFor="filter-degree" className="text-sm font-medium">
          Degree level
        </label>
        <AppSelect
          id="filter-degree"
          className="mt-1.5"
          value={degreeLevel}
          onChange={(value) => updateFilter("degree", value)}
          placeholder="All levels"
          options={degreeLevels.map((level) => ({ value: level, label: level }))}
        />
      </div>
    </SurfaceCard>
  );
}
