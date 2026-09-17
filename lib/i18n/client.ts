"use client";

import { useFormatter, useLocale } from "@/components/ui/locale";
import { getDictionary } from "./dictionary";

/** Strings and formatters for Client Components, following the language in LocaleProvider. */
export function useI18n() {
  const locale = useLocale();
  return { locale, t: getDictionary(locale), format: useFormatter() };
}
