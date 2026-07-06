"use client";

import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { parseApiError } from "@/components/admin/forms/api-error";
import { selectClassName } from "@/components/admin/forms/select-class";
import { FormField } from "@/components/forms/FormField";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { STORAGE_BUCKETS } from "@/constants";
import { uploadPublicFile } from "@/lib/storage/upload";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface SelectOption {
  id: string;
  name: string;
  country_id?: string;
}

interface Testimonial {
  id: string;
  student_name: string;
  destination_country: string | null;
  university_name: string | null;
  country_id: string | null;
  university_id: string | null;
  quote: string;
  image_url: string | null;
  rating: number | null;
  is_published: boolean;
}

interface TestimonialFormProps {
  countries: SelectOption[];
  universities: SelectOption[];
  initial?: Testimonial;
}

const FORM_ID = "testimonial-form";

export function TestimonialForm({ countries, universities, initial }: TestimonialFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [loading, setLoading] = useState(false);
  const [studentName, setStudentName] = useState(initial?.student_name ?? "");
  const [countryId, setCountryId] = useState(initial?.country_id ?? "");
  const [universityId, setUniversityId] = useState(initial?.university_id ?? "");
  const [quote, setQuote] = useState(initial?.quote ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [rating, setRating] = useState(initial?.rating?.toString() ?? "5");
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? false);

  const filteredUniversities = useMemo(
    () => (countryId ? universities.filter((u) => u.country_id === countryId) : universities),
    [countryId, universities]
  );

  function handleUniversityChange(value: string) {
    setUniversityId(value);
    const uni = universities.find((u) => u.id === value);
    if (uni?.country_id) setCountryId(uni.country_id);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      const file = formData.get("image") as File;
      let nextImageUrl = imageUrl || null;

      if (file?.size) {
        const path = `${Date.now()}-${file.name}`;
        const { publicUrl } = await uploadPublicFile(
          STORAGE_BUCKETS.testimonialImages,
          file,
          path
        );
        nextImageUrl = publicUrl;
        setImageUrl(publicUrl);
      }

      const payload = {
        student_name: studentName,
        country_id: countryId || null,
        university_id: universityId || null,
        quote,
        image_url: nextImageUrl,
        rating: rating ? Number(rating) : 5,
        is_published: isPublished,
      };

      const res = await fetch(
        isEdit ? `/api/admin/testimonials/${initial!.id}` : "/api/admin/testimonials",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(parseApiError(data, "Failed to save testimonial"));

      toast.success(isEdit ? "Testimonial updated" : "Testimonial created");
      router.push("/admin/testimonials");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminFormShell
      title={isEdit ? "Edit testimonial" : "New testimonial"}
      backHref="/admin/testimonials"
      formId={FORM_ID}
      saving={loading}
    >
      <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardContent className="space-y-4 p-6">
            <FormField label="Student name" htmlFor="student_name" required>
              <Input
                id="student_name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
              />
            </FormField>
            <div className="grid gap-4 sm:grid-cols-2">
              <FormField label="Destination country" htmlFor="country_id">
                <select
                  id="country_id"
                  value={countryId}
                  onChange={(e) => {
                    setCountryId(e.target.value);
                    setUniversityId("");
                  }}
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
                >
                  <option value="">Select university</option>
                  {filteredUniversities.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </FormField>
            </div>
            <FormField label="Quote" htmlFor="quote" required>
              <Textarea
                id="quote"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
                rows={4}
                required
              />
            </FormField>
            <FormField label="Photo" htmlFor="image">
              {imageUrl && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt={studentName}
                  className="mb-2 h-24 w-24 rounded-full border object-cover"
                />
              )}
              <Input id="image" name="image" type="file" accept="image/*" />
            </FormField>
            <FormField label="Rating (1–5)" htmlFor="rating">
              <Input
                id="rating"
                type="number"
                min={1}
                max={5}
                value={rating}
                onChange={(e) => setRating(e.target.value)}
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
