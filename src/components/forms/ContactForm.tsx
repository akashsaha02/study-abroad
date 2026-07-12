"use client";

import { App, Input } from "antd";
import { AppSelect } from "@/components/common/AppSelect";
import { FormField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface CountryOption {
  id: string;
  name: string;
}

interface ContactFormProps {
  countries: CountryOption[];
}

export function ContactForm({ countries }: ContactFormProps) {
  const t = useTranslations("public.contactForm");
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [countryId, setCountryId] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setLoading(true);
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          preferred_country_id: countryId || null,
          source: "contact_form",
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      message.success(t("success"));
      form.reset();
      setCountryId("");
    } catch (err) {
      message.error(err instanceof Error ? err.message : t("error"));
    } finally {
      setLoading(false);
    }
  }

  return (
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
      <FormField label={t("country")} htmlFor="preferred_country_id">
        <AppSelect
          id="preferred_country_id"
          value={countryId}
          onChange={setCountryId}
          placeholder={t("countryPlaceholder")}
          options={countries.map((c) => ({ value: c.id, label: c.name }))}
        />
      </FormField>
      <FormField label={t("message")} htmlFor="message">
        <Input.TextArea id="message" name="message" rows={4} size="large" />
      </FormField>
      <SubmitButton loading={loading} className="w-full">
        {t("submit")}
      </SubmitButton>
    </form>
  );
}
