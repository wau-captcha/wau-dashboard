"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Alert } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import type { TransactionStatus } from "@/lib/api/types";
import { useI18n } from "@/lib/i18n/client";
import { getTransactionAction } from "../actions";

/** How often, and for how long, the page asks whether SePay reported the payment. */
const POLL_MS = 2_000;
const PATIENCE_MS = 3 * 60_000;

export type CheckoutReturn = "success" | "cancel" | "error";

/**
 * The note on the page SePay sends the payer back to. The address only says how the payer left
 * SePay's page; the plan changes when SePay's own notification reaches wau-billing, so this asks
 * for the transaction until it succeeds or patience runs out.
 */
export function CheckoutResult({ transactionId, result }: { transactionId: string; result: CheckoutReturn }) {
  const text = useI18n().t.billing.result;
  const router = useRouter();
  const [status, setStatus] = useState<TransactionStatus | "unknown" | null>(null);
  const [gaveUp, setGaveUp] = useState(false);

  useEffect(() => {
    const started = Date.now();
    let timer: ReturnType<typeof setTimeout> | undefined;
    let stopped = false;

    async function check() {
      const { transaction } = await getTransactionAction(transactionId);
      if (stopped) return;
      const next = transaction?.status ?? "unknown";
      setStatus(next);
      if (next === "succeeded") {
        // Re-read the current plan and the history now that the payment is in.
        router.refresh();
        return;
      }
      if (next === "unknown" || result !== "success") return;
      if (Date.now() - started >= PATIENCE_MS) setGaveUp(true);
      else timer = setTimeout(check, POLL_MS);
    }

    void check();
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [transactionId, result, router]);

  // The payment's own page, which keeps checking too and shows what the payment did.
  const view = (
    <Link href={`/billing/history/${transactionId}`} className={buttonVariants({ variant: "outline", size: "sm" })}>
      {text.view}
    </Link>
  );

  if (status === "succeeded") {
    return (
      <Alert tone="positive" title={text.paidTitle} role="status" action={view}>
        {text.paid}
      </Alert>
    );
  }
  if (status === "unknown") return <Alert tone="negative">{text.unknown}</Alert>;
  if (result === "cancel") {
    return (
      <Alert tone="neutral" title={text.cancelledTitle} action={view}>
        {text.cancelled}
      </Alert>
    );
  }
  if (result === "error") {
    return (
      <Alert tone="negative" title={text.failedTitle} action={view}>
        {text.failed}
      </Alert>
    );
  }
  if (gaveUp) {
    return (
      <Alert tone="warning" title={text.slowTitle} action={view}>
        {text.slow}
      </Alert>
    );
  }
  return (
    <Alert tone="info" title={text.waitingTitle} icon={<Spinner />} role="status" action={view}>
      {text.waiting}
    </Alert>
  );
}
