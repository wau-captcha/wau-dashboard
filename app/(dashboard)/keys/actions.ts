"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createApiKey, deleteApiKey, rotateSecretKey, updateApiKey } from "@/lib/api/api-keys";
import { errorMessage, toApiFailure } from "@/lib/api/errors";
import { getCurrentUser } from "@/lib/dal";
import { formFailure, type FormFeedback } from "@/lib/form-message";
import { getI18n } from "@/lib/i18n/server";

export type KeyFormState = FormFeedback;

export type KeyActionResult = { error?: string };

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
    return formFailure(toApiFailure(error));
  }
  refreshKeys(id);
  // The new secret key is only worth showing on the detail page.
  redirect(`/keys/${id}`);
}

export async function renameKeyAction(_previous: KeyFormState, formData: FormData): Promise<KeyFormState> {
  await getCurrentUser();
  const id = String(formData.get("id") ?? "");
  const name = String(formData.get("name") ?? "").trim();
  if (!name) return { fieldErrors: { name: { kind: "keyNameEmpty" } } };

  try {
    await updateApiKey(id, { name });
  } catch (error) {
    return formFailure(toApiFailure(error));
  }
  refreshKeys(id);
  return {};
}

export async function setKeyActiveAction(id: string, isActive: boolean): Promise<KeyActionResult> {
  return mutate(id, () => updateApiKey(id, { isActive }));
}

export async function rotateSecretAction(id: string): Promise<KeyActionResult> {
  return mutate(id, () => rotateSecretKey(id));
}

export async function deleteKeyAction(id: string): Promise<KeyActionResult> {
  return mutate(id, () => deleteApiKey(id));
}
