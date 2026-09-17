import type { Dictionary } from "@/lib/i18n/dictionary";

type ErrorText = Dictionary["errors"];

/** A failed API call reduced to what the UI needs. Serializable, and translated where it is rendered. */
export type ApiFailure = { reason: string; field?: string };

/** Conflicts the API reports without a field, but that belong under one input. */
const conflictFields: Record<string, string> = {
  USERNAME_TAKEN: "username",
  EMAIL_TAKEN: "email",
};

/** The input a failure should be shown under, if any. */
export function failureField(failure: ApiFailure): string | undefined {
  return failure.field ?? conflictFields[failure.reason];
}

/** Translated text for a failure; unknown ones stay generic. */
export function describeFailure(failure: ApiFailure, t: ErrorText): string {
  const fields = t.fields as Record<string, string>;
  const reasons = t.reasons as Record<string, string>;
  return (failure.field && fields[failure.field]) || reasons[failure.reason] || t.generic;
}
