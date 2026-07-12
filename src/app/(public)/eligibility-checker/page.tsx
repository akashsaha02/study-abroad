"use client";

import { PageHeader } from "@/components/common/PageHeader";
import { PageLayout } from "@/components/common/PageLayout";
import { PanelCard } from "@/components/common/PanelCard";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { FormField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { POPULAR_COUNTRIES, ROUTES } from "@/constants";
import { selectClassName } from "@/lib/styles";
import { FileValidationIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";

interface Recommendation {
  recommended_countries: string[];
  study_level: string;
  university_category: string;
  english_feedback: string;
  budget_feedback: string;
  next_steps: string[];
}

export default function EligibilityCheckerPage() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Recommendation | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setResult(json.recommendation);
      toast.success("Eligibility check complete!");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Check failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Free tool"
        eyebrowIcon={FileValidationIcon}
        title="Eligibility checker"
        description="Find out which countries and programs match your profile. Free and instant."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <PanelCard title="Your profile">
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label="Full Name" htmlFor="name" required>
              <Input id="name" name="name" required />
            </FormField>
            <FormField label="Phone" htmlFor="phone" required>
              <Input id="phone" name="phone" type="tel" required />
            </FormField>
            <FormField label="Email" htmlFor="email">
              <Input id="email" name="email" type="email" />
            </FormField>
            <FormField label="Education Level" htmlFor="education_level" required>
              <select id="education_level" name="education_level" required className={selectClassName}>
                <option value="">Select</option>
                <option value="HSC">HSC / A-Level</option>
                <option value="Bachelor">Bachelor&apos;s</option>
                <option value="Master">Master&apos;s</option>
              </select>
            </FormField>
            <FormField label="Result / CGPA" htmlFor="last_result">
              <Input id="last_result" name="last_result" placeholder="e.g. 3.5" />
            </FormField>
            <FormField label="English Test" htmlFor="english_test_type">
              <select id="english_test_type" name="english_test_type" className={selectClassName}>
                <option value="">None yet</option>
                <option value="IELTS">IELTS</option>
                <option value="PTE">PTE</option>
                <option value="TOEFL">TOEFL</option>
              </select>
            </FormField>
            <FormField label="English Score" htmlFor="english_test_score">
              <Input id="english_test_score" name="english_test_score" placeholder="e.g. 6.5" />
            </FormField>
            <FormField label="Preferred Country" htmlFor="preferred_country">
              <select id="preferred_country" name="preferred_country" className={selectClassName}>
                <option value="">Any</option>
                {POPULAR_COUNTRIES.map((c) => (
                  <option key={c.slug} value={c.name}>{c.name}</option>
                ))}
              </select>
            </FormField>
            <FormField label="Preferred Subject" htmlFor="preferred_subject">
              <Input id="preferred_subject" name="preferred_subject" />
            </FormField>
            <FormField label="Budget (USD/year)" htmlFor="budget">
              <Input id="budget" name="budget" type="number" placeholder="15000" />
            </FormField>
            <FormField label="Study Level" htmlFor="study_level">
              <select id="study_level" name="study_level" className={selectClassName}>
                <option value="Bachelor">Bachelor&apos;s</option>
                <option value="Master">Master&apos;s</option>
                <option value="PhD">PhD</option>
              </select>
            </FormField>
            <FormField label="Gap Years" htmlFor="gap_years">
              <Input id="gap_years" name="gap_years" type="number" defaultValue={0} />
            </FormField>
            <SubmitButton loading={loading} className="w-full">
              Check eligibility
            </SubmitButton>
          </form>
        </PanelCard>

        {result ? (
          <PanelCard title="Your results">
            <div className="space-y-4 text-sm">
              <ResultRow label="Recommended countries" value={result.recommended_countries.join(", ")} />
              <ResultRow label="Study level" value={result.study_level} />
              <ResultRow label="University category" value={result.university_category} />
              <ResultRow label="English" value={result.english_feedback} />
              <ResultRow label="Budget" value={result.budget_feedback} />
              <div>
                <p className="font-medium">Next steps</p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                  {result.next_steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
            <Button asChild className="mt-6 w-full">
              <Link href={ROUTES.contact}>Book free consultation</Link>
            </Button>
          </PanelCard>
        ) : (
          <SurfaceCard
            hover={false}
            className="flex min-h-[300px] items-center justify-center text-center text-muted-foreground"
          >
            Fill in the form to see your personalized eligibility results
          </SurfaceCard>
        )}
      </div>
    </PageLayout>
  );
}

function ResultRow({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-medium">{label}</p>
      <p className="text-muted-foreground">{value}</p>
    </div>
  );
}
