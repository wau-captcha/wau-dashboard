/** Languages the dashboard ships. Safe to import from server, client and proxy code. */
export const LOCALES = ["en", "vi"] as const;

export type Locale = (typeof LOCALES)[number];

/** First visits are always English, whatever the browser prefers. */
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_COOKIE = "wau_locale";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/**
 * Intl tags used for numbers and dates. en-GB rather than en-US keeps dates day-first,
 * which DateInput relies on to read back what formatDate wrote (dd/mm/yyyy).
 */
export const INTL_LOCALE: Record<Locale, string> = {
  en: "en-GB",
  vi: "vi-VN",
};

/** Each language is named in itself, so users can find theirs whatever is selected. */
export const LOCALE_NAMES: Record<Locale, string> = {
  en: "English",
  vi: "Tiếng Việt",
};
