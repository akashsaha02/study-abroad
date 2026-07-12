"use client";

import { App, Card, Input } from "antd";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { SlugField } from "@/components/admin/SlugField";
import { parseApiError } from "@/components/admin/forms/api-error";
import { AppSelect } from "@/components/common/AppSelect";
import { FormField } from "@/components/forms/FormField";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";

interface UniversityOption {
  id: string;
  name: string;
}

interface Course {
  id: string;
  university_id: string;
  title: string;
  slug: string;
  degree_level: string | null;
  subject_area: string | null;
  duration: string | null;
  tuition_fee: number | null;
  application_fee: number | null;
  language_requirement: string | null;
  academic_requirement: string | null;
  intakes: string[] | null;
  is_published: boolean;
}

interface CourseFormProps {
  universities: UniversityOption[];
  initial?: Course;
}

const FORM_ID = "course-form";

function intakesToString(intakes: string[] | null | undefined) {
  return intakes?.join(", ") ?? "";
}

function parseIntakes(value: string) {
  const items = value
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  return items.length ? items : null;
}

export function CourseForm({ universities, initial }: CourseFormProps) {
  const { message } = App.useApp();
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [loading, setLoading] = useState(false);
  const [universityId, setUniversityId] = useState(
    initial?.university_id ?? universities[0]?.id ?? ""
  );
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [degreeLevel, setDegreeLevel] = useState(initial?.degree_level ?? "");
  const [subjectArea, setSubjectArea] = useState(initial?.subject_area ?? "");
  const [duration, setDuration] = useState(initial?.duration ?? "");
  const [tuitionFee, setTuitionFee] = useState(initial?.tuition_fee?.toString() ?? "");
  const [applicationFee, setApplicationFee] = useState(
    initial?.application_fee?.toString() ?? ""
  );
  const [languageRequirement, setLanguageRequirement] = useState(
    initial?.language_requirement ?? ""
  );
  const [academicRequirement, setAcademicRequirement] = useState(
    initial?.academic_requirement ?? ""
  );
  const [intakes, setIntakes] = useState(intakesToString(initial?.intakes));
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        university_id: universityId,
        title,
        slug,
        degree_level: degreeLevel || null,
        subject_area: subjectArea || null,
        duration: duration || null,
        tuition_fee: tuitionFee ? Number(tuitionFee) : null,
        application_fee: applicationFee ? Number(applicationFee) : null,
        language_requirement: languageRequirement || null,
        academic_requirement: academicRequirement || null,
        intakes: parseIntakes(intakes),
        is_published: isPublished,
      };

      const res = await fetch(
        isEdit ? `/api/admin/courses/${initial!.id}` : "/api/admin/courses",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(parseApiError(data, "Failed to save course"));

      message.success(isEdit ? "Course updated" : "Course created");
      router.push("/admin/courses");
      router.refresh();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminFormShell
      title={isEdit ? "Edit course" : "New course"}
      backHref="/admin/courses"
      formId={FORM_ID}
      saving={loading}
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <div className="space-y-4 p-6">
            <FormField label="University" htmlFor="university_id" required>
              <AppSelect
                id="university_id"
                value={universityId}
                onChange={setUniversityId}
                size="middle"
                allowClear={false}
                options={universities.map((u) => ({ value: u.id, label: u.name }))}
              />
            </FormField>
            <FormField label="Title" htmlFor="title" required>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </FormField>
            <SlugField title={title} value={slug} onChange={setSlug} />
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Degree level" htmlFor="degree_level">
                <Input
                  id="degree_level"
                  value={degreeLevel}
                  onChange={(e) => setDegreeLevel(e.target.value)}
                />
              </FormField>
              <FormField label="Subject area" htmlFor="subject_area">
                <Input
                  id="subject_area"
                  value={subjectArea}
                  onChange={(e) => setSubjectArea(e.target.value)}
                />
              </FormField>
              <FormField label="Duration" htmlFor="duration">
                <Input
                  id="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                />
              </FormField>
              <FormField label="Intakes (comma-separated)" htmlFor="intakes">
                <Input
                  id="intakes"
                  value={intakes}
                  onChange={(e) => setIntakes(e.target.value)}
                />
              </FormField>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Tuition fee" htmlFor="tuition_fee">
                <Input
                  id="tuition_fee"
                  type="number"
                  value={tuitionFee}
                  onChange={(e) => setTuitionFee(e.target.value)}
                />
              </FormField>
              <FormField label="Application fee" htmlFor="application_fee">
                <Input
                  id="application_fee"
                  type="number"
                  value={applicationFee}
                  onChange={(e) => setApplicationFee(e.target.value)}
                />
              </FormField>
            </div>
            <FormField label="Language requirement" htmlFor="language_requirement">
              <Input.TextArea
                id="language_requirement"
                value={languageRequirement}
                onChange={(e) => setLanguageRequirement(e.target.value)}
                rows={2}
              />
            </FormField>
            <FormField label="Academic requirement" htmlFor="academic_requirement">
              <Input.TextArea
                id="academic_requirement"
                value={academicRequirement}
                onChange={(e) => setAcademicRequirement(e.target.value)}
                rows={2}
              />
            </FormField>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
              />
              Published
            </label>
          </div>
        </Card>
      </form>
    </AdminFormShell>
  );
}
