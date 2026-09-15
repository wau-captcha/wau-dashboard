/**
 * Calendar-date helpers. All functions work on local dates at midnight and never mutate their input.
 * Dates are rebuilt from year/month/day parts so daylight-saving shifts cannot move a day.
 */

export type WeekStart = 0 | 1;

export function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

export function addDays(date: Date, days: number) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
}

/** Adds months, clamping the day to the end of the target month (31 Jan + 1 → 28/29 Feb). */
export function addMonths(date: Date, months: number) {
  const year = date.getFullYear();
  const month = date.getMonth() + months;
  return new Date(year, month, Math.min(date.getDate(), daysInMonth(year, month)));
}

export function startOfWeek(date: Date, weekStartsOn: WeekStart) {
  return addDays(date, -((date.getDay() - weekStartsOn + 7) % 7));
}

/** Negative when `a` is an earlier day than `b`, 0 on the same day. */
export function compareDay(a: Date, b: Date) {
  return startOfDay(a).getTime() - startOfDay(b).getTime();
}

/** Negative when `a` is in an earlier month than `b`, 0 in the same month. */
export function compareMonth(a: Date, b: Date) {
  return a.getFullYear() * 12 + a.getMonth() - (b.getFullYear() * 12 + b.getMonth());
}

export function isSameDay(a: Date | null | undefined, b: Date | null | undefined) {
  if (!a || !b) return a == b;
  return compareDay(a, b) === 0;
}

export function isSameMonth(a: Date, b: Date) {
  return compareMonth(a, b) === 0;
}

/** Six full weeks covering `month`, as rows of seven dates. */
export function getCalendarWeeks(month: Date, weekStartsOn: WeekStart) {
  const first = startOfWeek(startOfMonth(month), weekStartsOn);
  return Array.from({ length: 6 }, (_, week) => Array.from({ length: 7 }, (_, day) => addDays(first, week * 7 + day)));
}

/** "2026-09-15", in local time. */
export function toISODate(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Parses "2026-09-15" as a local date. */
export function parseISODate(text: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text.trim());
  return match ? buildDate(Number(match[1]), Number(match[2]), Number(match[3])) : null;
}

/** Parses day/month/year text such as "15/09/2026", "1-9-2026" or "01.09.2026". */
export function parseDisplayDate(text: string) {
  const match = /^(\d{1,2})[/.-](\d{1,2})[/.-](\d{4})$/.exec(text.trim());
  return match ? buildDate(Number(match[3]), Number(match[2]), Number(match[1])) : null;
}

/** Builds a local date, rejecting overflow such as 31/02. */
function buildDate(year: number, month: number, day: number) {
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}
