"use client";

import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { SlugField } from "@/components/admin/SlugField";
import { parseApiError } from "@/components/admin/forms/api-error";
import { selectClassName } from "@/components/admin/forms/select-class";
import { FormField } from "@/components/forms/FormField";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface SelectOption {
  id: string;
  name: string;
}

interface Scholarship {
  id: string;
  university_id: string | null;
  country_id: string | null;
  title: string;
  slug: string;
  degree_level: string | null;
  amount: string | null;
  eligibility: string | null;
  deadline: string | null;
  description: string | null;
  application_link: string | null;
  is_published: boolean;
}

interface ScholarshipFormProps {
  universities: SelectOption[];
  countries: SelectOption[];
  initial?: Scholarship;
}

const FORM_ID = "scholarship-form";

export function ScholarshipForm({
  universities,
  countries,
  initial,
}: ScholarshipFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [loading, setLoading] = useState(false);
  const [universityId, setUniversityId] = useState(initial?.university_id ?? "");
  const [countryId, setCountryId] = useState(initial?.country_id ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [degreeLevel, setDegreeLevel] = useState(initial?.degree_level ?? "");
  const [amount, setAmount] = useState(initial?.amount ?? "");
  const [eligibility, setEligibility] = useState(initial?.eligibility ?? "");
  const [deadline, setDeadline] = useState(initial?.deadline ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [applicationLink, setApplicationLink] = useState(initial?.application_link ?? "");
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        university_id: universityId || null,
        country_id: countryId || null,
        title,
        slug,
        degree_level: degreeLevel || null,
        amount: amount || null,
        eligibility: eligibility || null,
        deadline: deadline || null,
        description: description || null,
        application_link: applicationLink || null,
        is_published: isPublished,
      };

      const res = await fetch(
        isEdit
          ? `/api/admin/scholarships/${initial!.id}`
          : "/api/admin/scholarships",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(parseApiError(data, "Failed to save scholarship"));

      toast.success(isEdit ? "Scholarship updated" : "Scholarship created");
      router.push("/admin/scholarships");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminFormShell
      title={isEdit ? "Edit scholarship" : "New scholarship"}
      backHref="/admin/scholarships"
      formId={FORM_ID}
      saving={loading}
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="space-y-4 p-6">
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
              <FormField label="University" htmlFor="university_id">
                <select
                  id="university_id"
                  value={universityId}
                  onChange={(e) => setUniversityId(e.target.value)}
                  className={selectClassName}
                >
                  <option value="">None</option>
                  {universities.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Country" htmlFor="country_id">
                <select
                  id="country_id"
                  value={countryId}
                  onChange={(e) => setCountryId(e.target.value)}
                  className={selectClassName}
                >
                  <option value="">None</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Degree level" htmlFor="degree_level">
                <Input
                  id="degree_level"
                  value={degreeLevel}
                  onChange={(e) => setDegreeLevel(e.target.value)}
                />
              </FormField>
              <FormField label="Amount" htmlFor="amount">
                <Input
                  id="amount"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </FormField>
              <FormField label="Deadline" htmlFor="deadline">
                <Input
                  id="deadline"
                  type="date"
                  value={deadline ?? ""}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </FormField>
              <FormField label="Application link" htmlFor="application_link">
                <Input
                  id="application_link"
                  type="url"
                  value={applicationLink}
                  onChange={(e) => setApplicationLink(e.target.value)}
                />
              </FormField>
            </div>
            <FormField label="Eligibility" htmlFor="eligibility">
              <Textarea
                id="eligibility"
                value={eligibility}
                onChange={(e) => setEligibility(e.target.value)}
                rows={3}
              />
            </FormField>
            <FormField label="Description" htmlFor="description">
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
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
          </CardContent>
        </Card>
      </form>
    </AdminFormShell>
  );
}
