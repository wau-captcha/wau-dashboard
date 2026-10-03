"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

/** How often the page asks again while SePay has not confirmed the payment. */
const POLL_MS = 5_000;

/**
 * Renders the page again every few seconds until the checkout closes, so a payment SePay
 * confirms shows up by itself. The page stops rendering this once the payment is no longer
 * pending. Renders nothing.
 */
export function PendingRefresh({ until }: { until: string }) {
  const router = useRouter();

  useEffect(() => {
    // One more round after the deadline shows the checkout as closed.
    const stopAt = new Date(until).getTime() + POLL_MS;
    const timer = setInterval(() => {
      if (Date.now() > stopAt) clearInterval(timer);
      router.refresh();
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [until, router]);

  return null;
}
