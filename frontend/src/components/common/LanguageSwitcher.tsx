"use client";

import { routing, type Locale } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { Globe02Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useLocale, useTranslations } from "next-intl";
import { useTransition } from "react";

const LOCALE_META: Record<
  Locale,
  { label: string; short: string; flag: string }
> = {
  en: { label: "English", short: "EN", flag: "🇬🇧" },
  bn: { label: "বাংলা", short: "বাং", flag: "🇧🇩" },
};

export function LanguageSwitcher({ className }: { className?: string }) {
  const t = useTranslations("nav");
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  function switchLocale(nextLocale: Locale) {
    if (nextLocale === locale || isPending) return;
    startTransition(() => {
      router.replace(pathname, { locale: nextLocale });
    });
  }

  return (
    <div
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full border border-primary/25 bg-linear-to-r from-primary/10 via-primary/5 to-emerald-500/10 p-1 shadow-sm ring-1 ring-primary/15",
        isPending && "opacity-70",
        className
      )}
      role="group"
      aria-label={t("language")}
    >
      <span className="hidden pl-1.5 text-primary sm:inline-flex" aria-hidden>
        <HugeiconsIcon icon={Globe02Icon} className="size-4" />
      </span>
      {routing.locales.map((loc) => {
        const meta = LOCALE_META[loc];
        const active = locale === loc;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => switchLocale(loc)}
            disabled={isPending}
            aria-pressed={active}
            title={loc === "bn" ? t("bangla") : t("english")}
            className={cn(
              "flex min-w-10 items-center justify-center gap-1 rounded-full px-2.5 py-1.5 text-xs font-bold transition-all duration-200",
              active
                ? "bg-primary text-primary-foreground shadow-md shadow-primary/30 ring-1 ring-primary/40"
                : "text-foreground/65 hover:bg-white/70 hover:text-primary dark:hover:bg-white/10"
            )}
          >
            <span aria-hidden className="text-sm leading-none">
              {meta.flag}
            </span>
            <span>{meta.short}</span>
          </button>
        );
      })}
    </div>
  );
}
