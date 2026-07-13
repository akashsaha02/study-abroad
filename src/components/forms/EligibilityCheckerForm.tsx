"use client";

import { App, Button, Input } from "antd";
import { AppSelect } from "@/components/common/AppSelect";
import { CountrySelect, type CountryOption } from "@/components/common/CountrySelect";
import { PageHeader } from "@/components/common/PageHeader";
import { PageLayout } from "@/components/common/PageLayout";
import { PanelCard } from "@/components/common/PanelCard";
import { SurfaceCard } from "@/components/common/SurfaceCard";
import { FormField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { ENGLISH_TEST_TYPES, ROUTES } from "@/constants";
import { buildLeadContextUrl } from "@/lib/leads/urls";
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

export interface EligibilityInitialValues {
  name?: string;
  phone?: string;
  email?: string;
  education_level?: string;
  last_result?: string;
  english_test_type?: string;
  english_test_score?: string;
  preferred_country_id?: string;
  preferred_subject?: string;
  budget?: string;
  study_level?: string;
  gap_years?: string;
}

interface EligibilityCheckerFormProps {
  countries: CountryOption[];
  initialValues?: EligibilityInitialValues;
}

export function EligibilityCheckerForm({
  countries,
  initialValues = {},
}: EligibilityCheckerFormProps) {
  const t = useTranslations("public.eligibility");
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Recommendation | null>(null);
  const [name, setName] = useState(initialValues.name ?? "");
  const [phone, setPhone] = useState(initialValues.phone ?? "");
  const [email, setEmail] = useState(initialValues.email ?? "");
  const [educationLevel, setEducationLevel] = useState(initialValues.education_level ?? "");
  const [lastResult, setLastResult] = useState(initialValues.last_result ?? "");
  const [englishTestType, setEnglishTestType] = useState(initialValues.english_test_type ?? "");
  const [englishTestScore, setEnglishTestScore] = useState(
    initialValues.english_test_score ?? ""
  );
  const [preferredCountryId, setPreferredCountryId] = useState(
    initialValues.preferred_country_id ?? ""
  );
  const [preferredSubject, setPreferredSubject] = useState(
    initialValues.preferred_subject ?? ""
  );
  const [budget, setBudget] = useState(initialValues.budget ?? "");
  const [studyLevel, setStudyLevel] = useState(initialValues.study_level ?? "Bachelor");
  const [gapYears, setGapYears] = useState(initialValues.gap_years ?? "0");

  const educationOptions = [
    { value: "HSC", label: t("educationHSC") },
    { value: "Bachelor", label: t("educationBachelor") },
    { value: "Master", label: t("educationMaster") },
  ];

  const englishTestOptions = ENGLISH_TEST_TYPES.map((type) => ({
    value: type,
    label: type,
  }));

  const studyLevelOptions = [
    { value: "Bachelor", label: t("studyBachelor") },
    { value: "Master", label: t("studyMaster") },
    { value: "PhD", label: t("studyPhd") },
  ];

  const preferredCountryName =
    countries.find((c) => c.id === preferredCountryId)?.name ?? "";

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!educationLevel) {
      message.error(t("educationRequired"));
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/eligibility", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          phone,
          email,
          education_level: educationLevel,
          last_result: lastResult,
          english_test_type: englishTestType,
          english_test_score: englishTestScore,
          preferred_country: preferredCountryName,
          preferred_country_id: preferredCountryId || undefined,
          preferred_subject: preferredSubject,
          budget,
          study_level: studyLevel,
          gap_years: gapYears,
        }),
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

  const consultationHref = buildLeadContextUrl(ROUTES.bookConsultation, {
    country: countries.find((c) => c.id === preferredCountryId)?.slug,
    message: `Follow-up from eligibility check for ${name}`,
  });

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
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required size="large" />
            </FormField>
            <FormField label={t("phone")} htmlFor="phone" required>
              <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required size="large" />
            </FormField>
            <FormField label={t("email")} htmlFor="email">
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} size="large" />
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
                value={lastResult}
                onChange={(e) => setLastResult(e.target.value)}
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
                value={englishTestScore}
                onChange={(e) => setEnglishTestScore(e.target.value)}
                placeholder="e.g. 6.5"
                size="large"
              />
            </FormField>
            <FormField label={t("preferredCountry")} htmlFor="preferred_country">
              <CountrySelect
                id="preferred_country"
                countries={countries}
                value={preferredCountryId}
                onChange={setPreferredCountryId}
                placeholder={t("anyCountry")}
              />
            </FormField>
            <FormField label={t("subject")} htmlFor="preferred_subject">
              <Input
                id="preferred_subject"
                value={preferredSubject}
                onChange={(e) => setPreferredSubject(e.target.value)}
                size="large"
              />
            </FormField>
            <FormField label={t("budget")} htmlFor="budget">
              <Input
                id="budget"
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                placeholder="15000"
                size="large"
              />
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
              <Input
                id="gap_years"
                type="number"
                value={gapYears}
                onChange={(e) => setGapYears(e.target.value)}
                size="large"
              />
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
              <ResultRow label={t("universityCategory")} value={result.university_category} />
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
            <Link href={consultationHref}>
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
