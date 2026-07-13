"use client";

import { App, Input } from "antd";
import { AppDatePicker } from "@/components/common/AppDatePicker";
import { AppSelect } from "@/components/common/AppSelect";
import { CountrySelect, type CountryOption } from "@/components/common/CountrySelect";
import { FormField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { PanelCard } from "@/components/common/PanelCard";
import { ENGLISH_TEST_TYPES } from "@/constants";
import type { Profile, Student } from "@/types";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface StudentProfileFormProps {
  profile: Profile | null;
  student: Student | null;
  countries: CountryOption[];
}

export function StudentProfileForm({
  profile,
  student,
  countries,
}: StudentProfileFormProps) {
  const { message } = App.useApp();
  const router = useRouter();
  const t = useTranslations("dashboard");
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const nationalityCountry = countries.find((c) => c.name === student?.nationality);
  const [nationalityId, setNationalityId] = useState(nationalityCountry?.id ?? "");
  const [dateOfBirth, setDateOfBirth] = useState(student?.date_of_birth ?? "");
  const [highestEducation, setHighestEducation] = useState(
    student?.highest_education ?? ""
  );
  const [institutionName, setInstitutionName] = useState(
    student?.institution_name ?? ""
  );
  const [cgpa, setCgpa] = useState(student?.cgpa ?? "");
  const [englishTestType, setEnglishTestType] = useState(
    student?.english_test_type ?? ""
  );
  const [englishTestScore, setEnglishTestScore] = useState(
    student?.english_test_score ?? ""
  );
  const [preferredCountryIds, setPreferredCountryIds] = useState<string[]>(
    student?.preferred_country_ids ?? []
  );
  const [preferredSubject, setPreferredSubject] = useState(
    student?.preferred_subject ?? ""
  );
  const [currentAddress, setCurrentAddress] = useState(
    student?.current_address ?? ""
  );

  const resolvedNationalityId = nationalityId;

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const nationalityCountryName =
      countries.find((c) => c.id === resolvedNationalityId)?.name ?? "";

    try {
      const res = await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: fullName,
          phone,
          nationality: nationalityCountryName || undefined,
          date_of_birth: dateOfBirth || undefined,
          highest_education: highestEducation || undefined,
          institution_name: institutionName || undefined,
          cgpa: cgpa || undefined,
          english_test_type: englishTestType || undefined,
          english_test_score: englishTestScore || undefined,
          preferred_country_ids: preferredCountryIds,
          preferred_subject: preferredSubject || undefined,
          current_address: currentAddress || undefined,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to save");
      message.success(t("profileSaved"));
      router.refresh();
    } catch (err) {
      message.error(err instanceof Error ? err.message : t("profileSaveFailed"));
    } finally {
      setLoading(false);
    }
  }

  const englishTestOptions = ENGLISH_TEST_TYPES.map((type) => ({
    value: type,
    label: type,
  }));

  return (
    <PanelCard title={t("personalInfo")}>
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
        <FormField label={t("fullName")} htmlFor="full_name" required>
          <Input
            id="full_name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </FormField>
        <FormField label={t("phoneLabel")} htmlFor="phone">
          <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        </FormField>
        <FormField label={t("nationality")} htmlFor="nationality">
          <CountrySelect
            id="nationality"
            countries={countries}
            value={resolvedNationalityId}
            onChange={setNationalityId}
            placeholder={t("nationalityPlaceholder")}
          />
        </FormField>
        <FormField label={t("dateOfBirth")} htmlFor="date_of_birth">
          <AppDatePicker
            id="date_of_birth"
            value={dateOfBirth}
            onChange={setDateOfBirth}
          />
        </FormField>
        <FormField
          label={t("highestEducation")}
          htmlFor="highest_education"
          className="md:col-span-2"
        >
          <Input
            id="highest_education"
            value={highestEducation}
            onChange={(e) => setHighestEducation(e.target.value)}
          />
        </FormField>
        <FormField label={t("institution")} htmlFor="institution_name">
          <Input
            id="institution_name"
            value={institutionName}
            onChange={(e) => setInstitutionName(e.target.value)}
          />
        </FormField>
        <FormField label={t("cgpa")} htmlFor="cgpa">
          <Input id="cgpa" value={cgpa} onChange={(e) => setCgpa(e.target.value)} />
        </FormField>
        <FormField label={t("englishTest")} htmlFor="english_test_type">
          <AppSelect
            id="english_test_type"
            options={englishTestOptions}
            value={englishTestType}
            onChange={setEnglishTestType}
            placeholder={t("englishTestPlaceholder")}
          />
        </FormField>
        <FormField label={t("englishScore")} htmlFor="english_test_score">
          <Input
            id="english_test_score"
            value={englishTestScore}
            onChange={(e) => setEnglishTestScore(e.target.value)}
          />
        </FormField>
        <FormField
          label={t("preferredCountries")}
          htmlFor="preferred_country_ids"
          className="md:col-span-2"
        >
          <CountrySelect
            id="preferred_country_ids"
            multiple
            countries={countries}
            value={preferredCountryIds}
            onChange={setPreferredCountryIds}
            placeholder={t("preferredCountryPlaceholder")}
          />
        </FormField>
        <FormField label={t("preferredSubject")} htmlFor="preferred_subject">
          <Input
            id="preferred_subject"
            value={preferredSubject}
            onChange={(e) => setPreferredSubject(e.target.value)}
          />
        </FormField>
        <FormField label={t("address")} htmlFor="current_address" className="md:col-span-2">
          <Input.TextArea
            id="current_address"
            value={currentAddress}
            onChange={(e) => setCurrentAddress(e.target.value)}
          />
        </FormField>
        <div className="md:col-span-2">
          <SubmitButton loading={loading}>{t("saveProfile")}</SubmitButton>
        </div>
      </form>
    </PanelCard>
  );
}
