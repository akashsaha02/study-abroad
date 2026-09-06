"use client";

import { App, Input } from "antd";
import { CountrySelect, type CountryOption } from "@/components/common/CountrySelect";
import { FormField } from "@/components/forms/FormField";
import { SubmitButton } from "@/components/forms/SubmitButton";
import { apiFetch } from "@/infrastructure/api/client";
import type { LeadContextDefaults } from "@/features/leads/context";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface ContactFormProps {
  countries: CountryOption[];
  defaults?: LeadContextDefaults;
}

export function ContactForm({ countries, defaults = {} }: ContactFormProps) {
  const t = useTranslations("public.contactForm");
  const searchParams = useSearchParams();
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(defaults.name ?? "");
  const [phone, setPhone] = useState(defaults.phone ?? "");
  const [email, setEmail] = useState(defaults.email ?? "");
  const [countryId, setCountryId] = useState(defaults.countryId ?? "");
  const [messageText, setMessageText] = useState(defaults.message ?? "");
  const [universityId, setUniversityId] = useState(defaults.universityId ?? "");
  const [courseId, setCourseId] = useState(defaults.courseId ?? "");
  const [serviceSlug, setServiceSlug] = useState(defaults.serviceSlug ?? "");

  const contextLabel = useMemo(() => {
    if (defaults.universityName) return defaults.universityName;
    if (defaults.courseTitle) return defaults.courseTitle;
    if (defaults.serviceTitle) return defaults.serviceTitle;
    return null;
  }, [defaults]);

  useEffect(() => {
    async function loadContext() {
      const university = searchParams.get("university");
      const course = searchParams.get("course");
      const service = searchParams.get("service");
      const country = searchParams.get("country");
      const prefilledMessage = searchParams.get("message");
      if (!university && !course && !service && !country && !prefilledMessage) return;

      const res = await fetch(
        `/api/leads/context?${new URLSearchParams({
          ...(university ? { university } : {}),
          ...(course ? { course } : {}),
          ...(service ? { service } : {}),
          ...(country ? { country } : {}),
          ...(prefilledMessage ? { message: prefilledMessage } : {}),
        }).toString()}`
      );
      if (!res.ok) return;
      const ctx = (await res.json()) as LeadContextDefaults;
      if (ctx.name && !name) setName(ctx.name);
      if (ctx.email && !email) setEmail(ctx.email);
      if (ctx.phone && !phone) setPhone(ctx.phone);
      if (ctx.countryId) setCountryId(ctx.countryId);
      if (ctx.message && !messageText) setMessageText(ctx.message);
      if (ctx.universityId) setUniversityId(ctx.universityId);
      if (ctx.courseId) setCourseId(ctx.courseId);
      if (ctx.serviceSlug) setServiceSlug(ctx.serviceSlug);
    }
    void loadContext();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      await apiFetch("/api/leads", {
        method: "POST",
        body: JSON.stringify({
          name,
          email: email || undefined,
          phone,
          preferred_country_id: countryId || null,
          message: messageText || undefined,
          university_id: universityId || undefined,
          course_id: courseId || undefined,
          service_slug: serviceSlug || undefined,
          source: "contact_form",
        }),
      });
      message.success(t("success"));
      setName("");
      setPhone("");
      setEmail("");
      setCountryId("");
      setMessageText("");
    } catch (err) {
      message.error(err instanceof Error ? err.message : t("error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {contextLabel ? (
        <p className="rounded-xl bg-muted/60 px-4 py-3 text-sm text-muted-foreground">
          {t("contextLabel")}: <span className="font-medium text-foreground">{contextLabel}</span>
        </p>
      ) : null}
      <FormField label={t("name")} htmlFor="name" required>
        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required size="large" />
      </FormField>
      <FormField label={t("phone")} htmlFor="phone" required>
        <Input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          size="large"
        />
      </FormField>
      <FormField label={t("email")} htmlFor="email">
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          size="large"
        />
      </FormField>
      <FormField label={t("country")} htmlFor="preferred_country_id">
        <CountrySelect
          id="preferred_country_id"
          countries={countries}
          value={countryId}
          onChange={setCountryId}
          placeholder={t("countryPlaceholder")}
        />
      </FormField>
      <FormField label={t("message")} htmlFor="message">
        <Input.TextArea
          id="message"
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          rows={4}
          size="large"
        />
      </FormField>
      <SubmitButton loading={loading} className="w-full">
        {t("submit")}
      </SubmitButton>
    </form>
  );
}
