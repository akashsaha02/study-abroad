"use client";

import { App, Input } from "antd";
import { FormField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { PanelCard } from "@/components/common/PanelCard";
import type { Profile, Student } from "@/types";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface StudentProfileFormProps {
  profile: Profile | null;
  student: Student | null;
}

export function StudentProfileForm({ profile, student }: StudentProfileFormProps) {
  const { message } = App.useApp();
  const router = useRouter();
  const t = useTranslations("dashboard");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to save");
      message.success(t("profileSaved"));
      router.refresh();
    } catch {
      message.error(t("profileSaveFailed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <PanelCard title={t("personalInfo")}>
      <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
          <FormField label="Full Name" htmlFor="full_name" required>
            <Input id="full_name" name="full_name" defaultValue={profile?.full_name ?? ""} />
          </FormField>
          <FormField label="Phone" htmlFor="phone">
            <Input id="phone" name="phone" defaultValue={profile?.phone ?? ""} />
          </FormField>
          <FormField label="Nationality" htmlFor="nationality">
            <Input id="nationality" name="nationality" defaultValue={student?.nationality ?? ""} />
          </FormField>
          <FormField label="Date of Birth" htmlFor="date_of_birth">
            <Input id="date_of_birth" name="date_of_birth" type="date" defaultValue={student?.date_of_birth ?? ""} />
          </FormField>
          <FormField label="Highest Education" htmlFor="highest_education" className="md:col-span-2">
            <Input id="highest_education" name="highest_education" defaultValue={student?.highest_education ?? ""} />
          </FormField>
          <FormField label="Institution" htmlFor="institution_name">
            <Input id="institution_name" name="institution_name" defaultValue={student?.institution_name ?? ""} />
          </FormField>
          <FormField label="CGPA" htmlFor="cgpa">
            <Input id="cgpa" name="cgpa" defaultValue={student?.cgpa ?? ""} />
          </FormField>
          <FormField label="English Test" htmlFor="english_test_type">
            <Input id="english_test_type" name="english_test_type" defaultValue={student?.english_test_type ?? ""} />
          </FormField>
          <FormField label="English Score" htmlFor="english_test_score">
            <Input id="english_test_score" name="english_test_score" defaultValue={student?.english_test_score ?? ""} />
          </FormField>
          <FormField label="Preferred Country" htmlFor="preferred_country">
            <Input id="preferred_country" name="preferred_country" defaultValue={student?.preferred_country ?? ""} />
          </FormField>
          <FormField label="Preferred Subject" htmlFor="preferred_subject">
            <Input id="preferred_subject" name="preferred_subject" defaultValue={student?.preferred_subject ?? ""} />
          </FormField>
          <FormField label="Address" htmlFor="current_address" className="md:col-span-2">
            <Input.TextArea id="current_address" name="current_address" defaultValue={student?.current_address ?? ""} />
          </FormField>
          <div className="md:col-span-2">
            <SubmitButton loading={loading}>{t("saveProfile")}</SubmitButton>
          </div>
        </form>
    </PanelCard>
  );
}
