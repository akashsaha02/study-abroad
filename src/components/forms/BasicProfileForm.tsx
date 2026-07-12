"use client";

import { App, Input } from "antd";
import { FormField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { PanelCard } from "@/components/common/PanelCard";
import type { Profile } from "@/types";
import { useRouter } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface BasicProfileFormProps {
  profile: Profile | null;
}

export function BasicProfileForm({ profile }: BasicProfileFormProps) {
  const { message } = App.useApp();
  const router = useRouter();
  const t = useTranslations("dashboard");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/student/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          full_name: formData.get("full_name"),
          phone: formData.get("phone"),
        }),
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
        <FormField label={t("fullName")} htmlFor="full_name" required>
          <Input
            id="full_name"
            name="full_name"
            defaultValue={profile?.full_name ?? ""}
          />
        </FormField>
        <FormField label={t("phone")} htmlFor="phone">
          <Input id="phone" name="phone" defaultValue={profile?.phone ?? ""} />
        </FormField>
        <div className="md:col-span-2">
          <SubmitButton loading={loading}>{t("saveProfile")}</SubmitButton>
        </div>
      </form>
    </PanelCard>
  );
}
