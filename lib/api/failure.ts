import type { Dictionary } from "@/lib/i18n/dictionary";

type ErrorText = Dictionary["errors"];

/** A failed API call reduced to what the UI needs. Serializable, and translated where it is rendered. */
export type ApiFailure = { reason: string; field?: string };

/** Translated text for a failure; unknown ones stay generic. */
export function describeFailure(failure: ApiFailure, t: ErrorText): string {
  const fields = t.fields as Record<string, string>;
  const reasons = t.reasons as Record<string, string>;
  return (failure.field && fields[failure.field]) || reasons[failure.reason] || t.generic;
}
