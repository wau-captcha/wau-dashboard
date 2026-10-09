"use server";

import { revalidatePath } from "next/cache";
import { unstable_rethrow } from "next/navigation";
import { decideAppeal, setApiKeySuspended, setUserBanned } from "@/lib/api/admin";
import { errorMessage } from "@/lib/api/errors";
import { getCurrentAdmin } from "@/lib/dal";
import { getI18n } from "@/lib/i18n/server";

export type AdminActionResult = { error?: string };

/**
 * Runs one admin change and re-reads the pages that show it. Server Actions are public
 * endpoints: wau-services checks that the caller is an administrator, this only checks the
 * arguments have the right shape.
 */
async function run(valid: boolean, paths: string[], change: () => Promise<unknown>): Promise<AdminActionResult> {
  await getCurrentAdmin();
  const { t } = await getI18n();
  if (!valid) return { error: t.errors.generic };
  try {
    await change();
  } catch (error) {
    // A rejected session signs the browser out through a redirect.
    unstable_rethrow(error);
    return { error: errorMessage(error, t.errors) };
  }
  for (const path of paths) revalidatePath(path);
  return {};
}

export async function setUserBannedAction(userId: string, banned: boolean): Promise<AdminActionResult> {
  return run(typeof userId === "string" && typeof banned === "boolean", ["/admin", "/admin/users", `/admin/users/${userId}`], () =>
    setUserBanned(userId, banned),
  );
}

/** Approves or rejects a pending appeal; the key it is about changes on approval. */
export async function decideAppealAction(appealId: string, approve: boolean, note: string): Promise<AdminActionResult> {
  return run(typeof appealId === "string" && typeof approve === "boolean" && typeof note === "string", ["/admin", "/admin/appeals"], () =>
    decideAppeal(appealId, approve, note),
  );
}

export async function setKeySuspendedAction(userId: string, apiKeyId: string, suspended: boolean): Promise<AdminActionResult> {
  return run(
    typeof userId === "string" && typeof apiKeyId === "string" && typeof suspended === "boolean",
    ["/admin", `/admin/users/${userId}`],
    () => setApiKeySuspended(apiKeyId, suspended),
  );
}
