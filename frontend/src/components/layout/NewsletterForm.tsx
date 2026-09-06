"use client";

import { App, Button, Input } from "antd";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

export function NewsletterForm() {
  const t = useTranslations("footer");
  const tAuth = useTranslations("auth");
  const { message } = App.useApp();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      message.success(t("newsletterSuccess"));
      setEmail("");
    } catch (err) {
      message.error(err instanceof Error ? err.message : t("newsletterError"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <form className="flex w-full max-w-md gap-2" onSubmit={handleSubmit}>
      <label htmlFor="newsletter-email" className="sr-only">
        {tAuth("email")}
      </label>
      <Input
        id="newsletter-email"
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t("emailPlaceholder")}
        className="h-10 flex-1 rounded-4xl"
      />
      <Button type="primary" htmlType="submit" loading={loading} className="shrink-0">
        {t("subscribe")}
        <HugeiconsIcon icon={ArrowRight01Icon} className="size-4" data-icon="inline-end" />
      </Button>
    </form>
  );
}
