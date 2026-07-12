"use client";

import { App, Card, Input } from "antd";
import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { SlugField } from "@/components/admin/SlugField";
import { parseApiError } from "@/components/admin/forms/api-error";
import { AppSelect } from "@/components/common/AppSelect";
import { FormField } from "@/components/forms/FormField";
import { STORAGE_BUCKETS } from "@/constants";
import { uploadPublicFile } from "@/lib/storage/upload";
import { useRouter } from "@/i18n/navigation";
import { useState } from "react";

interface CountryOption {
  id: string;
  name: string;
}

interface University {
  id: string;
  country_id: string;
  name: string;
  slug: string;
  city: string | null;
  logo_url: string | null;
  website_url: string | null;
  ranking: string | null;
  description: string | null;
  tuition_min: number | null;
  tuition_max: number | null;
  application_fee: number | null;
  requirements: string | null;
  intakes: string[] | null;
  scholarship_available: boolean;
  is_featured: boolean;
  is_published: boolean;
}

interface UniversityFormProps {
  countries: CountryOption[];
  initial?: University;
}

const FORM_ID = "university-form";

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

export function UniversityForm({ countries, initial }: UniversityFormProps) {
  const { message } = App.useApp();
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [loading, setLoading] = useState(false);
  const [countryId, setCountryId] = useState(initial?.country_id ?? countries[0]?.id ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [city, setCity] = useState(initial?.city ?? "");
  const [logoUrl, setLogoUrl] = useState(initial?.logo_url ?? "");
  const [websiteUrl, setWebsiteUrl] = useState(initial?.website_url ?? "");
  const [ranking, setRanking] = useState(initial?.ranking ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [tuitionMin, setTuitionMin] = useState(initial?.tuition_min?.toString() ?? "");
  const [tuitionMax, setTuitionMax] = useState(initial?.tuition_max?.toString() ?? "");
  const [applicationFee, setApplicationFee] = useState(
    initial?.application_fee?.toString() ?? ""
  );
  const [requirements, setRequirements] = useState(initial?.requirements ?? "");
  const [intakes, setIntakes] = useState(intakesToString(initial?.intakes));
  const [scholarshipAvailable, setScholarshipAvailable] = useState(
    initial?.scholarship_available ?? false
  );
  const [isFeatured, setIsFeatured] = useState(initial?.is_featured ?? false);
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const file = formData.get("logo") as File;
      let nextLogoUrl = logoUrl || null;

      if (file?.size) {
        const path = `${Date.now()}-${file.name}`;
        const { publicUrl } = await uploadPublicFile(
          STORAGE_BUCKETS.universityLogos,
          file,
          path
        );
        nextLogoUrl = publicUrl;
        setLogoUrl(publicUrl);
      }

      const payload = {
        country_id: countryId,
        name,
        slug,
        city: city || null,
        logo_url: nextLogoUrl,
        website_url: websiteUrl || null,
        ranking: ranking || null,
        description: description || null,
        tuition_min: tuitionMin ? Number(tuitionMin) : null,
        tuition_max: tuitionMax ? Number(tuitionMax) : null,
        application_fee: applicationFee ? Number(applicationFee) : null,
        requirements: requirements || null,
        intakes: parseIntakes(intakes),
        scholarship_available: scholarshipAvailable,
        is_featured: isFeatured,
        is_published: isPublished,
      };

      const res = await fetch(
        isEdit ? `/api/admin/universities/${initial!.id}` : "/api/admin/universities",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(parseApiError(data, "Failed to save university"));

      message.success(isEdit ? "University updated" : "University created");
      router.push("/admin/universities");
      router.refresh();
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminFormShell
      title={isEdit ? "Edit university" : "New university"}
      backHref="/admin/universities"
      formId={FORM_ID}
      saving={loading}
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <div className="space-y-4 p-6">
            <FormField label="Country" htmlFor="country_id" required>
              <AppSelect
                id="country_id"
                value={countryId}
                onChange={setCountryId}
                size="middle"
                allowClear={false}
                options={countries.map((c) => ({ value: c.id, label: c.name }))}
              />
            </FormField>
            <FormField label="Name" htmlFor="name" required>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </FormField>
            <SlugField title={name} value={slug} onChange={setSlug} />
            <FormField label="City" htmlFor="city">
              <Input id="city" value={city} onChange={(e) => setCity(e.target.value)} />
            </FormField>
            <FormField label="Logo" htmlFor="logo">
              {logoUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logoUrl}
                  alt="Logo"
                  className="mb-2 h-16 w-auto rounded-md border object-contain"
                />
              )}
              <Input id="logo" name="logo" type="file" accept="image/*" />
            </FormField>
            <FormField label="Website URL" htmlFor="website_url">
              <Input
                id="website_url"
                type="url"
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
              />
            </FormField>
            <FormField label="Ranking" htmlFor="ranking">
              <Input
                id="ranking"
                value={ranking}
                onChange={(e) => setRanking(e.target.value)}
              />
            </FormField>
            <FormField label="Description" htmlFor="description">
              <Input.TextArea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </FormField>
            <FormField label="Intakes (comma-separated)" htmlFor="intakes">
              <Input
                id="intakes"
                value={intakes}
                onChange={(e) => setIntakes(e.target.value)}
              />
            </FormField>
            <div className="flex flex-wrap gap-4 text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={scholarshipAvailable}
                  onChange={(e) => setScholarshipAvailable(e.target.checked)}
                />
                Scholarship available
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                />
                Featured
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                />
                Published
              </label>
            </div>
          </div>
        </Card>
        <Card>
          <div className="space-y-4 p-6">
            <h2 className="font-semibold">Fees</h2>
            <div className="grid gap-4 sm:grid-cols-3">
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
              <FormField label="Application fee" htmlFor="application_fee">
                <Input
                  id="application_fee"
                  type="number"
                  value={applicationFee}
                  onChange={(e) => setApplicationFee(e.target.value)}
                />
              </FormField>
            </div>
            <FormField label="Requirements" htmlFor="requirements">
              <Input.TextArea
                id="requirements"
                value={requirements}
                onChange={(e) => setRequirements(e.target.value)}
                rows={3}
              />
            </FormField>
          </div>
        </Card>
      </form>
    </AdminFormShell>
  );
}
