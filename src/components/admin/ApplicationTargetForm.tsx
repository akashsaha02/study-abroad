"use client";

import { parseApiError } from "@/components/admin/forms/api-error";
import { selectClassName } from "@/components/admin/forms/select-class";
import { FormField } from "@/components/forms/FormField";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useMemo, useState } from "react";
import { toast } from "sonner";

interface SelectOption {
  id: string;
  name: string;
  country_id?: string;
  university_id?: string;
}

interface ApplicationTargetFormProps {
  applicationId: string;
  countries: SelectOption[];
  universities: SelectOption[];
  courses: SelectOption[];
  initial: {
    country_id: string | null;
    university_id: string | null;
    course_id: string | null;
  };
}

export function ApplicationTargetForm({
  applicationId,
  countries,
  universities,
  courses,
  initial,
}: ApplicationTargetFormProps) {
  const [loading, setLoading] = useState(false);
  const [countryId, setCountryId] = useState(initial.country_id ?? "");
  const [universityId, setUniversityId] = useState(initial.university_id ?? "");
  const [courseId, setCourseId] = useState(initial.course_id ?? "");

  const filteredUniversities = useMemo(
    () =>
      countryId
        ? universities.filter((u) => u.country_id === countryId)
        : universities,
    [countryId, universities]
  );

  const filteredCourses = useMemo(
    () =>
      universityId
        ? courses.filter((c) => c.university_id === universityId)
        : courses,
    [universityId, courses]
  );

  function handleCountryChange(value: string) {
    setCountryId(value);
    setUniversityId("");
    setCourseId("");
  }

  function handleUniversityChange(value: string) {
    setUniversityId(value);
    setCourseId("");
    const uni = universities.find((u) => u.id === value);
    if (uni?.country_id) setCountryId(uni.country_id);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/applications/${applicationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          country_id: countryId || null,
          university_id: universityId || null,
          course_id: courseId || null,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(parseApiError(data, "Failed to update application"));

      toast.success("Application targets updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="mb-4 font-semibold">Study targets</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <FormField label="Country" htmlFor="country_id">
            <select
              id="country_id"
              value={countryId}
              onChange={(e) => handleCountryChange(e.target.value)}
              className={selectClassName}
            >
              <option value="">Select country</option>
              {countries.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="University" htmlFor="university_id">
            <select
              id="university_id"
              value={universityId}
              onChange={(e) => handleUniversityChange(e.target.value)}
              className={selectClassName}
              disabled={filteredUniversities.length === 0}
            >
              <option value="">Select university</option>
              {filteredUniversities.map((u) => (
                <option key={u.id} value={u.id}>
                  {u.name}
                </option>
              ))}
            </select>
          </FormField>
          <FormField label="Course" htmlFor="course_id">
            <select
              id="course_id"
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className={selectClassName}
              disabled={filteredCourses.length === 0}
            >
              <option value="">Select course</option>
              {filteredCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </FormField>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving…" : "Save targets"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
