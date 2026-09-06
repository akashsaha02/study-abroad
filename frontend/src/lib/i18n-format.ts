import { useLocale, useTranslations } from "next-intl";

export function useDateLocale() {
  const locale = useLocale();
  return locale === "bn" ? "bn-BD" : "en-US";
}

export function formatDate(
  date: string | Date,
  locale: string,
  options?: Intl.DateTimeFormatOptions
) {
  return new Date(date).toLocaleDateString(
    locale,
    options ?? { year: "numeric", month: "short", day: "numeric" }
  );
}

export function useFormatDate() {
  const dateLocale = useDateLocale();
  return (date: string | Date, options?: Intl.DateTimeFormatOptions) =>
    formatDate(date, dateLocale, options);
}

export function translateMessageKey<TFunc extends (key: never) => string>(
  t: TFunc,
  key: string
): string {
  return t(key as Parameters<TFunc>[0]);
}

export const translateStatus = translateMessageKey;

export function useStatusLabel() {
  const t = useTranslations("status");
  return (status: string) => {
    try {
      return translateStatus(t, status);
    } catch {
      return status.replace(/_/g, " ");
    }
  };
}

export function useLeadSourceLabel() {
  const t = useTranslations("leadSource");
  return (source: string) => {
    try {
      return translateMessageKey(t, source);
    } catch {
      return source.replace(/_/g, " ");
    }
  };
}
