"use server";

import { unstable_rethrow } from "next/navigation";
import { createCheckout, getTransaction } from "@/lib/api/billing";
import { errorMessage } from "@/lib/api/errors";
import type { BillingPeriod, Checkout, Transaction } from "@/lib/api/types";
import { getCurrentUser } from "@/lib/dal";
import { getI18n } from "@/lib/i18n/server";

export type CheckoutResult = { error?: string; actionUrl?: string; fields?: Checkout["fields"] };

export type TransactionResult = { error?: string; transaction?: Transaction };

/** Opens a pending transaction; the browser then posts the signed fields to SePay, in order. */
export async function startCheckoutAction(tierId: string, period: BillingPeriod): Promise<CheckoutResult> {
  await getCurrentUser();
  const { t } = await getI18n();
  try {
    const checkout = await createCheckout(tierId, period === "year" ? "year" : "month");
    return { actionUrl: checkout.action_url, fields: checkout.fields };
  } catch (error) {
    // A rejected session signs the browser out through a redirect.
    unstable_rethrow(error);
    return { error: errorMessage(error, t.errors) };
  }
}

/** One of the user's transactions, for the page SePay sends the payer back to. */
export async function getTransactionAction(id: string): Promise<TransactionResult> {
  await getCurrentUser();
  const { t } = await getI18n();
  try {
    return { transaction: await getTransaction(id) };
  } catch (error) {
    unstable_rethrow(error);
    return { error: errorMessage(error, t.errors) };
  }
}
