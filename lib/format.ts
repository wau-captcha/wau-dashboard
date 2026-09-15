/**
 * Locale-aware formatting shared by all components.
 * Locale and time zone are fixed (not read from the runtime) so server and client render the same text.
 */
export const DEFAULT_LOCALE = "vi-VN";
export const DEFAULT_TIME_ZONE = "Asia/Ho_Chi_Minh";

type DateLike = Date | string | number;

const formatters = new Map<string, Intl.NumberFormat | Intl.DateTimeFormat>();

/** Returns a cached Intl.NumberFormat. */
export function getNumberFormatter(locale = DEFAULT_LOCALE, options?: Intl.NumberFormatOptions) {
  const key = `n|${locale}|${JSON.stringify(options ?? {})}`;
  let formatter = formatters.get(key);
  if (!formatter) formatters.set(key, (formatter = new Intl.NumberFormat(locale, options)));
  return formatter as Intl.NumberFormat;
}

/** Returns a cached Intl.DateTimeFormat. */
export function getDateFormatter(locale = DEFAULT_LOCALE, options?: Intl.DateTimeFormatOptions) {
  const key = `d|${locale}|${JSON.stringify(options ?? {})}`;
  let formatter = formatters.get(key);
  if (!formatter) formatters.set(key, (formatter = new Intl.DateTimeFormat(locale, options)));
  return formatter as Intl.DateTimeFormat;
}

/** 1234567.891 → "1.234.567,891" */
export function formatNumber(value: number, options?: Intl.NumberFormatOptions, locale = DEFAULT_LOCALE) {
  return getNumberFormatter(locale, options).format(value);
}

/** 3400000 → "3,4 Tr" */
export function formatCompactNumber(value: number, locale = DEFAULT_LOCALE) {
  return getNumberFormatter(locale, { notation: "compact", maximumFractionDigits: 1 }).format(value);
}

/** 0.1234 → "12,3%" */
export function formatPercent(ratio: number, locale = DEFAULT_LOCALE) {
  return getNumberFormatter(locale, { style: "percent", maximumFractionDigits: 1 }).format(ratio);
}

/**
 * Formats a calendar date (no time) in the viewer's local time zone: "15/09/2026".
 * Use for values picked with DateInput / DateRangeInput.
 */
export function formatDate(value: DateLike, locale = DEFAULT_LOCALE) {
  return getDateFormatter(locale, { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date(value));
}

/**
 * Formats an instant, such as an API timestamp, in DEFAULT_TIME_ZONE as "15/09/2026 14:05:09".
 * Date comes first (vi-VN's native order is time first) so table columns scan by day.
 */
export function formatDateTime(value: DateLike, options?: { seconds?: boolean }, locale = DEFAULT_LOCALE) {
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
