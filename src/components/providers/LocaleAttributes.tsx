"use client";

import { useLayoutEffect } from "react";

/** Keeps document.documentElement.lang in sync when html/body live in the root layout. */
export function LocaleAttributes({ locale }: { locale: string }) {
  useLayoutEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
