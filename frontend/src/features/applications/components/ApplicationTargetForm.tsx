"use client";

import { App, Button } from "antd";
import { parseApiError } from "@/components/admin/forms/api-error";
import { GlassPanelCard } from "@/components/common/GlassCard";
import { AppSelect } from "@/components/common/AppSelect";
import { FormField } from "@/components/forms/FormField";
import { useMemo, useState } from "react";

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
  /** When true, render without outer glass card (for sidebars). */
  embedded?: boolean;
}

export function ApplicationTargetForm({
  applicationId,
  countries,
  universities,
  courses,
  initial,
  embedded = false,
}: ApplicationTargetFormProps) {
  const { message } = App.useApp();
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

      message.success("Application targets updated");
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Failed to update");
    } finally {
      setLoading(false);
    }
  }

  const body = (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField label="Country" htmlFor="country_id">
        <AppSelect
          id="country_id"
          value={countryId}
          onChange={handleCountryChange}
          placeholder="Select country"
          size="middle"
          options={countries.map((c) => ({ value: c.id, label: c.name }))}
        />
      </FormField>
      <FormField label="University" htmlFor="university_id">
        <AppSelect
          id="university_id"
          value={universityId}
          onChange={handleUniversityChange}
          placeholder="Select university"
          size="middle"
          disabled={filteredUniversities.length === 0}
          options={filteredUniversities.map((u) => ({ value: u.id, label: u.name }))}
        />
      </FormField>
      <FormField label="Course" htmlFor="course_id">
        <AppSelect
          id="course_id"
          value={courseId}
          onChange={setCourseId}
          placeholder="Select course"
          size="middle"
          disabled={filteredCourses.length === 0}
          options={filteredCourses.map((c) => ({ value: c.id, label: c.name }))}
        />
      </FormField>
      <Button htmlType="submit" disabled={loading} type="primary" block>
        {loading ? "Saving…" : "Save targets"}
      </Button>
    </form>
  );

  if (embedded) return body;

  return (
    <GlassPanelCard title="Study targets" variant="glass">
      {body}
    </GlassPanelCard>
  );
}
