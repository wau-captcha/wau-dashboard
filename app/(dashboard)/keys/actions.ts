"use server";

import { revalidatePath } from "next/cache";
import { redirect, unstable_rethrow } from "next/navigation";
import {
  createApiKey,
  deleteApiKey,
  revokePreviousSecret,
  rotateSecretKey,
  setAllowedOrigins,
  updateApiKey,
} from "@/lib/api/api-keys";
import { errorMessage, toApiFailure } from "@/lib/api/errors";
import type { AllowedOrigin } from "@/lib/api/types";
import { getCurrentUser } from "@/lib/dal";
import { formFailure, type FormFeedback } from "@/lib/form-message";
import { getI18n } from "@/lib/i18n/server";

export type KeyFormState = FormFeedback;

export type KeyActionResult = { error?: string };

/** A saved list comes back normalised by wau-services, so the table can show what was stored. */
export type KeyOriginsResult = KeyActionResult & { origins?: AllowedOrigin[] };

/** Re-reads pages that show keys or usage after a change. */
function refreshKeys(id?: string) {
  revalidatePath("/keys");
  revalidatePath("/overview");
  if (id) revalidatePath(`/keys/${id}`);
}

/** Runs one key mutation for the signed-in user and reports a translated error. */
async function mutate(id: string, run: () => Promise<unknown>): Promise<KeyActionResult> {
  await getCurrentUser();
  const { t } = await getI18n();
  try {
    await run();
  } catch (error) {
    // A rejected session signs the browser out through a redirect.
    unstable_rethrow(error);
    return { error: errorMessage(error, t.errors) };
  }
  refreshKeys(id);
  return {};
}

export async function createKeyAction(_previous: KeyFormState, formData: FormData): Promise<KeyFormState> {
  await getCurrentUser();
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { fieldErrors: { name: { kind: "keyNameRequired" } } };

  let id: string;
  try {
    id = (await createApiKey(name)).id;
  } catch (error) {
    unstable_rethrow(error);
    return formFailure(toApiFailure(error));
  }
  refreshKeys(id);
  // The new secret key is only worth showing on the detail page.
  redirect(`/keys/${id}`);
}

export async function renameKeyAction(id: string, name: string): Promise<KeyFormState> {
  await getCurrentUser();
  const trimmed = name.trim();
  if (!trimmed) return { fieldErrors: { name: { kind: "keyNameEmpty" } } };

  try {
    await updateApiKey(id, { name: trimmed });
  } catch (error) {
    unstable_rethrow(error);
    return formFailure(toApiFailure(error));
  }
  refreshKeys(id);
  return {};
}

export async function setKeyActiveAction(id: string, isActive: boolean): Promise<KeyActionResult> {
  return mutate(id, () => updateApiKey(id, { isActive }));
}

/** Saves the whole table at once; wau-services checks the addresses and normalises them. */
export async function setAllowedOriginsAction(
  id: string,
  origins: { ip_address: string; description: string }[],
): Promise<KeyOriginsResult> {
  await getCurrentUser();
  const { t } = await getI18n();
  if (!Array.isArray(origins)) return { error: t.errors.generic };

  let saved: AllowedOrigin[];
  try {
    saved = (await setAllowedOrigins(id, origins)).allowed_origins ?? [];
  } catch (error) {
    unstable_rethrow(error);
    return { error: errorMessage(error, t.errors) };
  }
  refreshKeys(id);
  return { origins: saved };
}

export async function revokePreviousSecretAction(id: string): Promise<KeyActionResult> {
  return mutate(id, () => revokePreviousSecret(id));
}

export async function rotateSecretAction(id: string): Promise<KeyActionResult> {
  return mutate(id, () => rotateSecretKey(id));
}

export async function deleteKeyAction(id: string): Promise<KeyActionResult> {
  return mutate(id, () => deleteApiKey(id));
}
