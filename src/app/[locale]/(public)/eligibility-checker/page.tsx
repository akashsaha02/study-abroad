"use client";

import { App, Button, Input } from "antd";
import { AppSelect } from "@/components/common/AppSelect";
import { PageHeader } from "@/components/common/PageHeader";
import { PageLayout } from "@/components/common/PageLayout";
import { PanelCard } from "@/components/common/PanelCard";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { FormField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { POPULAR_COUNTRIES, ROUTES } from "@/constants";
import { FileValidationIcon } from "@hugeicons/core-free-icons";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface Recommendation {
  recommended_countries: string[];
  study_level: string;
  university_category: string;
  english_feedback: string;
  budget_feedback: string;
  next_steps: string[];
}

export default function EligibilityCheckerPage() {
  const t = useTranslations("public.eligibility");
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Recommendation | null>(null);
  const [educationLevel, setEducationLevel] = useState("");
  const [englishTestType, setEnglishTestType] = useState("");
  const [preferredCountry, setPreferredCountry] = useState("");
  const [studyLevel, setStudyLevel] = useState("Bachelor");

  const educationOptions = [
    { value: "HSC", label: t("educationHSC") },
    { value: "Bachelor", label: t("educationBachelor") },
    { value: "Master", label: t("educationMaster") },
  ];

  const englishTestOptions = [
    { value: "IELTS", label: "IELTS" },
    { value: "PTE", label: "PTE" },
    { value: "TOEFL", label: "TOEFL" },
  ];

  const studyLevelOptions = [
    { value: "Bachelor", label: t("studyBachelor") },
    { value: "Master", label: t("studyMaster") },
    { value: "PhD", label: t("studyPhd") },
  ];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!educationLevel) {
      message.error(t("educationRequired"));
      return;
    }
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = {
      ...Object.fromEntries(formData),
      education_level: educationLevel,
      english_test_type: englishTestType,
      preferred_country: preferredCountry,
      study_level: studyLevel,
    };

    try {
      const res = await fetch("/api/eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setResult(json.recommendation);
      message.success(t("success"));
    } catch (err) {
      message.error(err instanceof Error ? err.message : t("error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <PageLayout>
      <PageHeader
        eyebrow={t("eyebrow")}
        eyebrowIcon={FileValidationIcon}
        title={t("title")}
        description={t("description")}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <PanelCard title={t("profile")}>
          <form onSubmit={handleSubmit} className="space-y-4">
            <FormField label={t("name")} htmlFor="name" required>
              <Input id="name" name="name" required size="large" />
            </FormField>
            <FormField label={t("phone")} htmlFor="phone" required>
              <Input id="phone" name="phone" type="tel" required size="large" />
            </FormField>
            <FormField label={t("email")} htmlFor="email">
              <Input id="email" name="email" type="email" size="large" />
            </FormField>
            <FormField label={t("education")} htmlFor="education_level" required>
              <AppSelect
                id="education_level"
                value={educationLevel}
                onChange={setEducationLevel}
                placeholder={t("educationPlaceholder")}
                options={educationOptions}
              />
            </FormField>
            <FormField label={t("result")} htmlFor="last_result">
              <Input
                id="last_result"
                name="last_result"
                placeholder={t("resultPlaceholder")}
                size="large"
              />
            </FormField>
            <FormField label={t("englishTest")} htmlFor="english_test_type">
              <AppSelect
                id="english_test_type"
                value={englishTestType}
                onChange={setEnglishTestType}
                placeholder={t("englishNone")}
                options={englishTestOptions}
              />
            </FormField>
            <FormField label={t("englishScore")} htmlFor="english_test_score">
              <Input
                id="english_test_score"
                name="english_test_score"
                placeholder="e.g. 6.5"
                size="large"
              />
            </FormField>
            <FormField label={t("preferredCountry")} htmlFor="preferred_country">
              <AppSelect
                id="preferred_country"
                value={preferredCountry}
                onChange={setPreferredCountry}
                placeholder={t("anyCountry")}
                showSearch
                options={POPULAR_COUNTRIES.map((c) => ({
                  value: c.name,
                  label: c.name,
                }))}
              />
            </FormField>
            <FormField label={t("subject")} htmlFor="preferred_subject">
              <Input id="preferred_subject" name="preferred_subject" size="large" />
            </FormField>
            <FormField label={t("budget")} htmlFor="budget">
              <Input id="budget" name="budget" type="number" placeholder="15000" size="large" />
            </FormField>
            <FormField label={t("studyLevel")} htmlFor="study_level">
              <AppSelect
                id="study_level"
                value={studyLevel}
                onChange={setStudyLevel}
                allowClear={false}
                options={studyLevelOptions}
              />
            </FormField>
            <FormField label={t("gapYears")} htmlFor="gap_years">
              <Input id="gap_years" name="gap_years" type="number" defaultValue={0} size="large" />
            </FormField>
            <SubmitButton loading={loading} className="w-full">
              {t("submit")}
            </SubmitButton>
          </form>
        </PanelCard>

        {result ? (
          <PanelCard title={t("results")}>
            <div className="space-y-4 text-sm">
              <ResultRow
                label={t("recommendedCountries")}
                value={result.recommended_countries.join(", ")}
              />
              <ResultRow label={t("studyLevelLabel")} value={result.study_level} />
              <ResultRow
                label={t("universityCategory")}
                value={result.university_category}
              />
              <ResultRow label={t("englishFeedback")} value={result.english_feedback} />
              <ResultRow label={t("budgetFeedback")} value={result.budget_feedback} />
              <div>
                <p className="font-medium">{t("nextSteps")}</p>
                <ul className="mt-1 list-disc space-y-1 pl-5 text-muted-foreground">
                  {result.next_steps.map((s) => (
                    <li key={s}>{s}</li>
                  ))}
                </ul>
              </div>
            </div>
            <Link href={ROUTES.contact}>
              <Button className="mt-6 w-full" size="large" type="primary">
                {t("bookConsultation")}
              </Button>
            </Link>
          </PanelCard>
        ) : (
          <SurfaceCard
            hover={false}
            className="flex min-h-[300px] items-center justify-center text-center text-muted-foreground"
          >
            {t("resultsEmpty")}
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
