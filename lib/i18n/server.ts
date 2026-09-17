import "server-only";

import { cookies } from "next/headers";
import { cache } from "react";
import { createFormatter } from "@/lib/format";
import { DEFAULT_LOCALE, isLocale, LOCALE_COOKIE, type Locale } from "./config";
import { getDictionary } from "./dictionary";

/** Language of the current request: the cookie when valid, English otherwise. */
export const getLocale = cache(async (): Promise<Locale> => {
  const value = (await cookies()).get(LOCALE_COOKIE)?.value;
  return isLocale(value) ? value : DEFAULT_LOCALE;
});

/** Strings and formatters for Server Components and Server Actions. */
export const getI18n = cache(async () => {
  const locale = await getLocale();
  return { locale, t: getDictionary(locale), format: createFormatter(locale) };
});
