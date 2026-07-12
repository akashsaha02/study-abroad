"use client";

import { AppSelect } from "@/components/common/AppSelect";
import { routing, type Locale } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function onChange(nextLocale: Locale) {
    if (nextLocale === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <AppSelect
      className={className}
      value={locale}
      loading={isPending}
      onChange={(value) => onChange(value as Locale)}
      allowClear={false}
      size="middle"
      aria-label={t("language")}
      style={{ minWidth: 112 }}
      options={routing.locales.map((loc) => ({
        value: loc,
        label: loc === "bn" ? t("bangla") : t("english"),
      }))}
    />
  );
}
