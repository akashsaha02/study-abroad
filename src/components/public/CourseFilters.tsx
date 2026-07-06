"use client";

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
    <div className="mb-8 flex flex-wrap gap-4">
      <div className="min-w-[200px] flex-1">
        <label htmlFor="filter-country" className="text-sm font-medium">
          Country
        </label>
        <select
          id="filter-country"
          value={countryId}
          onChange={(e) => updateFilter("country", e.target.value)}
          className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
        >
          <option value="">All countries</option>
          {countries.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>
      <div className="min-w-[200px] flex-1">
        <label htmlFor="filter-degree" className="text-sm font-medium">
          Degree level
        </label>
        <select
          id="filter-degree"
          value={degreeLevel}
          onChange={(e) => updateFilter("degree", e.target.value)}
          className="mt-1 flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
        >
          <option value="">All levels</option>
          {degreeLevels.map((level) => (
            <option key={level} value={level}>
              {level}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
