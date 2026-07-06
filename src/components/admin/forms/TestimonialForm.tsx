"use client";

import { AdminFormShell } from "@/components/admin/AdminFormShell";
import { parseApiError } from "@/components/admin/forms/api-error";
import { FormField } from "@/components/forms/FormField";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { STORAGE_BUCKETS } from "@/constants";
import { uploadPublicFile } from "@/lib/storage/upload";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

interface Testimonial {
  id: string;
  student_name: string;
  destination_country: string | null;
  university_name: string | null;
  quote: string;
  image_url: string | null;
  rating: number | null;
  is_published: boolean;
}

interface TestimonialFormProps {
  initial?: Testimonial;
}

const FORM_ID = "testimonial-form";

export function TestimonialForm({ initial }: TestimonialFormProps) {
  const router = useRouter();
  const isEdit = Boolean(initial);
  const [loading, setLoading] = useState(false);
  const [studentName, setStudentName] = useState(initial?.student_name ?? "");
  const [destinationCountry, setDestinationCountry] = useState(
    initial?.destination_country ?? ""
  );
  const [universityName, setUniversityName] = useState(initial?.university_name ?? "");
  const [quote, setQuote] = useState(initial?.quote ?? "");
  const [imageUrl, setImageUrl] = useState(initial?.image_url ?? "");
  const [rating, setRating] = useState(initial?.rating?.toString() ?? "5");
  const [isPublished, setIsPublished] = useState(initial?.is_published ?? false);

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
        destination_country: destinationCountry || null,
        university_name: universityName || null,
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
              <FormField label="Destination country" htmlFor="destination_country">
                <Input
                  id="destination_country"
                  value={destinationCountry}
                  onChange={(e) => setDestinationCountry(e.target.value)}
                />
              </FormField>
              <FormField label="University name" htmlFor="university_name">
                <Input
                  id="university_name"
                  value={universityName}
                  onChange={(e) => setUniversityName(e.target.value)}
                />
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
