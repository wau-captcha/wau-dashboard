import { describeFailure, type ApiFailure } from "@/lib/api/failure";
import type { Dictionary } from "@/lib/i18n/dictionary";

/**
 * What a form action wants to tell the user, kept language-neutral. Form state survives a
 * language switch, so the text is produced where it is rendered rather than in the action.
 */
export type FormMessage =
  | { kind: "api"; failure: ApiFailure }
  | { kind: "googleSessionExpired" | "keyNameRequired" | "keyNameEmpty" };

export type FormFeedback = {
  /** Shown above the form. */
  error?: FormMessage;
  /** Shown under the input with the same name. */
  fieldErrors?: Record<string, FormMessage>;
};

export function formMessageText(message: FormMessage, t: Dictionary): string {
  switch (message.kind) {
    case "api":
      return describeFailure(message.failure, t.errors);
    case "googleSessionExpired":
      return t.auth.login.sessionExpired;
    case "keyNameRequired":
      return t.keys.validation.nameRequired;
    case "keyNameEmpty":
      return t.keys.validation.nameEmpty;
  }
}

/** Places an API failure under its input when it has one, above the form otherwise. */
export function formFailure(failure: ApiFailure): FormFeedback {
  const message: FormMessage = { kind: "api", failure };
  return failure.field ? { fieldErrors: { [failure.field]: message } } : { error: message };
}
