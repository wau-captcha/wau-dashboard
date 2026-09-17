import { DEFAULT_LOCALE, INTL_LOCALE, type Locale } from "@/lib/i18n/config";

/**
 * Locale-aware formatting shared by all components.
 * The time zone is fixed (not read from the runtime) so server and client render the same text.
 * Prefer `createFormatter(locale)` (server) or `useFormatter()` (client) over passing Intl tags around.
 */
export const DEFAULT_INTL_LOCALE = INTL_LOCALE[DEFAULT_LOCALE];
export const DEFAULT_TIME_ZONE = "Asia/Ho_Chi_Minh";

export type DateLike = Date | string | number;

const formatters = new Map<string, Intl.NumberFormat | Intl.DateTimeFormat>();

/** Returns a cached Intl.NumberFormat. */
export function getNumberFormatter(locale = DEFAULT_INTL_LOCALE, options?: Intl.NumberFormatOptions) {
  const key = `n|${locale}|${JSON.stringify(options ?? {})}`;
  let formatter = formatters.get(key);
  if (!formatter) formatters.set(key, (formatter = new Intl.NumberFormat(locale, options)));
  return formatter as Intl.NumberFormat;
}

/** Returns a cached Intl.DateTimeFormat. */
export function getDateFormatter(locale = DEFAULT_INTL_LOCALE, options?: Intl.DateTimeFormatOptions) {
  const key = `d|${locale}|${JSON.stringify(options ?? {})}`;
  let formatter = formatters.get(key);
  if (!formatter) formatters.set(key, (formatter = new Intl.DateTimeFormat(locale, options)));
  return formatter as Intl.DateTimeFormat;
}

/** 1234567.891 → "1,234,567.891" (en) / "1.234.567,891" (vi) */
export function formatNumber(value: number, options?: Intl.NumberFormatOptions, locale = DEFAULT_INTL_LOCALE) {
  return getNumberFormatter(locale, options).format(value);
}

/** 3400000 → "3.4M" (en) / "3,4 Tr" (vi) */
export function formatCompactNumber(value: number, locale = DEFAULT_INTL_LOCALE) {
  return getNumberFormatter(locale, { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

/** 0.1234 → "12.3%" (en) / "12,3%" (vi) */
export function formatPercent(ratio: number, locale = DEFAULT_INTL_LOCALE) {
  return getNumberFormatter(locale, { style: "percent", maximumFractionDigits: 1 }).format(ratio);
}

/**
 * Formats a calendar date (no time) in the viewer's local time zone: "15/09/2026" in both languages.
 * Use for values picked with DateInput / DateRangeInput.
 */
export function formatDate(value: DateLike, locale = DEFAULT_INTL_LOCALE) {
  return getDateFormatter(locale, { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
}

/**
 * Formats an instant, such as an API timestamp, in DEFAULT_TIME_ZONE as "15/09/2026 14:05:09".
 * Assembled from parts so every locale reads date first, then a 24-hour time.
 */
export function formatDateTime(value: DateLike, options?: { seconds?: boolean }, locale = DEFAULT_INTL_LOCALE) {
  const withSeconds = options?.seconds !== false;
  const parts = getDateFormatter(locale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: withSeconds ? "2-digit" : undefined,
    hourCycle: "h23",
    timeZone: DEFAULT_TIME_ZONE,
  }).formatToParts(new Date(value));
  const part = (type: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === type)?.value ?? "";
  const time = withSeconds ? `${part("hour")}:${part("minute")}:${part("second")}` : `${part("hour")}:${part("minute")}`;
  return `${part("day")}/${part("month")}/${part("year")} ${time}`;
}

/** The formatting functions bound to one language. */
export type Formatter = {
  /** Intl tag behind this formatter, for components that call Intl directly. */
  intl: string;
  number: (value: number, options?: Intl.NumberFormatOptions) => string;
  compact: (value: number) => string;
  percent: (ratio: number) => string;
  date: (value: DateLike) => string;
  dateTime: (value: DateLike, options?: { seconds?: boolean }) => string;
};

const boundFormatters = new Map<Locale, Formatter>();

/** Cached per language, so client hooks hand out a stable object. */
export function createFormatter(locale: Locale): Formatter {
  let formatter = boundFormatters.get(locale);
  if (!formatter) {
    const intl = INTL_LOCALE[locale];
    formatter = {
      intl,
      number: (value, options) => formatNumber(value, options, intl),
      compact: (value) => formatCompactNumber(value, intl),
      percent: (ratio) => formatPercent(ratio, intl),
      date: (value) => formatDate(value, intl),
      dateTime: (value, options) => formatDateTime(value, options, intl),
    };
    boundFormatters.set(locale, formatter);
  }
  return formatter;
}
