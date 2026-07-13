"use client";

import { App, Button, Input } from "antd";
import { useTranslations } from "next-intl";
import { useState } from "react";

interface ServiceOrderButtonProps {
  serviceId: string;
  serviceTitle: string;
  defaultName?: string;
  defaultEmail?: string;
  defaultPhone?: string;
}

export function ServiceOrderButton({
  serviceId,
  serviceTitle,
  defaultName = "",
  defaultEmail = "",
  defaultPhone = "",
}: ServiceOrderButtonProps) {
  const t = useTranslations("public.serviceOrder");
  const { message } = App.useApp();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(defaultName);
  const [email, setEmail] = useState(defaultEmail);
  const [phone, setPhone] = useState(defaultPhone);

  async function handleOrder() {
    setLoading(true);
    try {
      const res = await fetch("/api/service-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: serviceId,
          name: name || undefined,
          email: email || undefined,
          phone: phone || undefined,
          notes: `Order request for ${serviceTitle}`,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      message.success(t("success"));
    } catch (err) {
      message.error(err instanceof Error ? err.message : t("error"));
    } finally {
      setLoading(false);
    }
  }

  const needsGuestInfo = !defaultName || !defaultPhone;

  return (
    <div className="space-y-3">
      {needsGuestInfo ? (
        <>
          <Input
            placeholder={t("name")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            size="large"
          />
          <Input
            placeholder={t("phone")}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            size="large"
          />
          <Input
            placeholder={t("email")}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            size="large"
          />
        </>
      ) : null}
      <Button type="primary" size="large" loading={loading} onClick={handleOrder} block>
        {t("orderNow")}
      </Button>
    </div>
  );
}
