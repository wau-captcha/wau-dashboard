"use client";

import { createContext, use, type ReactNode } from "react";
import { createFormatter } from "@/lib/format";
import { DEFAULT_LOCALE, type Locale } from "@/lib/i18n/config";
import { uiText } from "./ui-text";

const LocaleContext = createContext<Locale>(DEFAULT_LOCALE);

/** Supplies the active language to client components; mounted once in app Providers. */
export function LocaleProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  return <LocaleContext value={locale}>{children}</LocaleContext>;
}

/** Active language, English outside a provider. */
export function useLocale(): Locale {
  return use(LocaleContext);
}

/** Number and date formatting for the active language. */
export function useFormatter() {
  return createFormatter(useLocale());
}

/** Default component strings for the active language. */
export function useUIText() {
  return uiText[useLocale()];
}
