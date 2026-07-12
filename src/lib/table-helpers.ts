import { LEAD_SOURCES, LEAD_STATUSES } from "@/constants";
import type { useTranslations } from "next-intl";

type TFunction = ReturnType<typeof useTranslations>;

export function buildStatusFilters(t: TFunction) {
  return LEAD_STATUSES.map((status) => ({
    text: t(status),
    value: status,
  }));
}

export function buildLeadSourceFilters(t: TFunction) {
  return LEAD_SOURCES.map((source) => ({
    text: t(source),
    value: source,
  }));
}

export function buildUniqueFilters<T extends string>(
  values: readonly (T | null | undefined)[],
  t?: (value: T) => string
) {
  const unique = [...new Set(values.filter(Boolean) as T[])].sort();
  return unique.map((value) => ({
    text: t ? t(value) : value,
    value,
  }));
}

export function buildPublishedFilters(tCommon: TFunction) {
  return [
    { text: tCommon("published"), value: "true" },
    { text: tCommon("draft"), value: "false" },
  ];
}
