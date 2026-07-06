"use client";

import { Container } from "@/components/common/Container";
import { PageHeader } from "@/components/common/PageHeader";
import { FormField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { POPULAR_COUNTRIES } from "@/constants";
import { ROUTES } from "@/constants";
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
    <Container className="py-12">
      <PageHeader
        title="Eligibility Checker"
        description="Find out which countries and programs match your profile. Free and instant."
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <Card>
          <CardContent className="p-6">
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
                <select
                  id="education_level"
                  name="education_level"
                  required
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                >
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
                <select
                  id="english_test_type"
                  name="english_test_type"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                >
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
                <select
                  id="preferred_country"
                  name="preferred_country"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                >
                  <option value="">Any</option>
                  {POPULAR_COUNTRIES.map((c) => (
                    <option key={c.slug} value={c.name}>
                      {c.name}
                    </option>
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
                <select
                  id="study_level"
                  name="study_level"
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm"
                >
                  <option value="Bachelor">Bachelor&apos;s</option>
                  <option value="Master">Master&apos;s</option>
                  <option value="PhD">PhD</option>
                </select>
              </FormField>
              <FormField label="Gap Years" htmlFor="gap_years">
                <Input id="gap_years" name="gap_years" type="number" defaultValue={0} />
              </FormField>
              <SubmitButton loading={loading} className="w-full">
                Check Eligibility
              </SubmitButton>
            </form>
          </CardContent>
        </Card>

        <div>
          {result ? (
            <Card>
              <CardContent className="space-y-4 p-6">
                <h3 className="text-lg font-semibold">Your Results</h3>
                <div>
                  <p className="text-sm font-medium">Recommended Countries</p>
                  <p className="text-muted-foreground">
                    {result.recommended_countries.join(", ")}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Study Level</p>
                  <p className="text-muted-foreground">{result.study_level}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">University Category</p>
                  <p className="text-muted-foreground">{result.university_category}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">English</p>
                  <p className="text-muted-foreground">{result.english_feedback}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Budget</p>
                  <p className="text-muted-foreground">{result.budget_feedback}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Next Steps</p>
                  <ul className="list-disc pl-5 text-sm text-muted-foreground">
                    {result.next_steps.map((s) => (
                      <li key={s}>{s}</li>
                    ))}
                  </ul>
                </div>
                <Button asChild className="w-full">
                  <Link href={ROUTES.contact}>Book Free Consultation</Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-dashed">
              <CardContent className="flex h-full min-h-[300px] items-center justify-center p-6 text-center text-muted-foreground">
                Fill in the form to see your personalized eligibility results
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </Container>
  );
}
