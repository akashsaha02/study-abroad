"use client";

import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { SlugField } from "@/components/admin/SlugField";
import { parseApiError } from "@/components/admin/forms/api-error";
import { FormField } from "@/components/forms/FormField";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Country {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  hero_title: string | null;
  hero_subtitle: string | null;
  tuition_min: number | null;
  tuition_max: number | null;
  living_cost_min: number | null;
  living_cost_max: number | null;
  visa_summary: string | null;
  admission_requirements: string | null;
  scholarship_summary: string | null;
  intakes: string[] | null;
  is_published: boolean;
}

interface CountryFormProps {
  initial?: Country;
}

const FORM_ID = "country-form";

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

export function CountryForm({ initial }: CountryFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [heroTitle, setHeroTitle] = useState(initial?.hero_title ?? "");
  const [heroSubtitle, setHeroSubtitle] = useState(initial?.hero_subtitle ?? "");
  const [tuitionMin, setTuitionMin] = useState(initial?.tuition_min?.toString() ?? "");
  const [tuitionMax, setTuitionMax] = useState(initial?.tuition_max?.toString() ?? "");
  const [livingMin, setLivingMin] = useState(initial?.living_cost_min?.toString() ?? "");
  const [livingMax, setLivingMax] = useState(initial?.living_cost_max?.toString() ?? "");
  const [visaSummary, setVisaSummary] = useState(initial?.visa_summary ?? "");
  const [admissionRequirements, setAdmissionRequirements] = useState(
    initial?.admission_requirements ?? ""
  );
  const [scholarshipSummary, setScholarshipSummary] = useState(
    initial?.scholarship_summary ?? ""
  );
  const [intakes, setIntakes] = useState(intakesToString(initial?.intakes));
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        name,
        slug,
        description: description || null,
        hero_title: heroTitle || null,
        hero_subtitle: heroSubtitle || null,
        tuition_min: tuitionMin ? Number(tuitionMin) : null,
        tuition_max: tuitionMax ? Number(tuitionMax) : null,
        living_cost_min: livingMin ? Number(livingMin) : null,
        living_cost_max: livingMax ? Number(livingMax) : null,
        visa_summary: visaSummary || null,
        admission_requirements: admissionRequirements || null,
        scholarship_summary: scholarshipSummary || null,
        intakes: parseIntakes(intakes),
        is_published: isPublished,
      };

      const res = await fetch(
        isEdit ? `/api/admin/countries/${initial!.id}` : "/api/admin/countries",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(parseApiError(data, "Failed to save country"));

      toast.success(isEdit ? "Country updated" : "Country created");
      router.push("/admin/countries");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminFormShell
      title={isEdit ? "Edit country" : "New country"}
      backHref="/admin/countries"
      formId={FORM_ID}
      saving={loading}
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="space-y-4 p-6">
            <FormField label="Name" htmlFor="name" required>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormField>
            <SlugField title={name} value={slug} onChange={setSlug} />
            <FormField label="Description" htmlFor="description">
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Hero title" htmlFor="hero_title">
                <Input
                  id="hero_title"
                  value={heroTitle}
                  onChange={(e) => setHeroTitle(e.target.value)}
                />
              </FormField>
              <FormField label="Hero subtitle" htmlFor="hero_subtitle">
                <Input
                  id="hero_subtitle"
                  value={heroSubtitle}
                  onChange={(e) => setHeroSubtitle(e.target.value)}
                />
              </FormField>
            </div>
            <FormField label="Intakes (comma-separated)" htmlFor="intakes">
              <Input
                id="intakes"
                value={intakes}
                onChange={(e) => setIntakes(e.target.value)}
                placeholder="September, January"
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
        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="font-semibold">Costs</h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Tuition min" htmlFor="tuition_min">
                <Input
                  id="tuition_min"
                  type="number"
                  value={tuitionMin}
                  onChange={(e) => setTuitionMin(e.target.value)}
                />
              </FormField>
              <FormField label="Tuition max" htmlFor="tuition_max">
                <Input
                  id="tuition_max"
                  type="number"
                  value={tuitionMax}
                  onChange={(e) => setTuitionMax(e.target.value)}
                />
              </FormField>
              <FormField label="Living cost min" htmlFor="living_cost_min">
                <Input
                  id="living_cost_min"
                  type="number"
                  value={livingMin}
                  onChange={(e) => setLivingMin(e.target.value)}
                />
              </FormField>
              <FormField label="Living cost max" htmlFor="living_cost_max">
                <Input
                  id="living_cost_max"
                  type="number"
                  value={livingMax}
                  onChange={(e) => setLivingMax(e.target.value)}
                />
              </FormField>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="space-y-4 p-6">
            <h2 className="font-semibold">Details</h2>
            <FormField label="Visa summary" htmlFor="visa_summary">
              <Textarea
                id="visa_summary"
                value={visaSummary}
                onChange={(e) => setVisaSummary(e.target.value)}
                rows={3}
              />
            </FormField>
            <FormField label="Admission requirements" htmlFor="admission_requirements">
              <Textarea
                id="admission_requirements"
                value={admissionRequirements}
                onChange={(e) => setAdmissionRequirements(e.target.value)}
                rows={3}
              />
            </FormField>
            <FormField label="Scholarship summary" htmlFor="scholarship_summary">
              <Textarea
                id="scholarship_summary"
                value={scholarshipSummary}
                onChange={(e) => setScholarshipSummary(e.target.value)}
                rows={3}
              />
            </FormField>
          </CardContent>
        </Card>
      </form>
    </AdminFormShell>
  );
}
