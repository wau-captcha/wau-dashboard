import type { Dictionary } from "@/lib/i18n/dictionary";
import { ApiError } from "./client";
import { describeFailure, type ApiFailure } from "./failure";

/** Keeps only what the UI may show; anything that is not an API error becomes a generic failure. */
export function toApiFailure(error: unknown): ApiFailure {
  if (!(error instanceof ApiError)) return { reason: "UNKNOWN" };
  return error.field ? { reason: error.reason, field: error.field } : { reason: error.reason };
}

/** Translated text for transient feedback such as toasts. */
export function errorMessage(error: unknown, t: Dictionary["errors"]): string {
  return describeFailure(toApiFailure(error), t);
}
