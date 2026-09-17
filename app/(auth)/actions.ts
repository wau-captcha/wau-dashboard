"use server";

import { redirect } from "next/navigation";
import { login, register } from "@/lib/api/auth";
import { toApiFailure } from "@/lib/api/errors";
import { formFailure, type FormFeedback } from "@/lib/form-message";
import { setSessionCookie } from "@/lib/session";

export type AuthFormState = FormFeedback & {
  /** Values echoed back so the user does not retype them. */
  values?: Record<string, string>;
};

/** Only same-site paths are accepted, so the form cannot bounce users elsewhere. */
function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/overview";
}

function failure(error: unknown, values: Record<string, string>): AuthFormState {
  return { ...formFailure(toApiFailure(error)), values };
}

export async function loginAction(_previous: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const identifier = String(formData.get("identifier") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!identifier || !password) {
    return { error: { kind: "loginRequired" }, values: { identifier } };
  }

  try {
    const reply = await login({ identifier, password });
    await setSessionCookie(reply.access_token, reply.expires_in);
  } catch (error) {
    return failure(error, { identifier });
  }
  // redirect throws, so it must run outside the try block.
  redirect(safeNext(formData.get("next")));
}

export async function registerAction(_previous: AuthFormState, formData: FormData): Promise<AuthFormState> {
  const username = String(formData.get("username") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!username || !email || !password) {
    return { error: { kind: "registerRequired" }, values: { username, email } };
  }

  try {
    const reply = await register({ username, email, password });
    await setSessionCookie(reply.access_token, reply.expires_in);
  } catch (error) {
    return failure(error, { username, email });
  }
  redirect("/overview");
}
