import { Alert } from "@/components/ui/alert";
import { Spinner } from "@/components/ui/spinner";
import type { Transaction } from "@/lib/api/types";
import { getI18n } from "@/lib/i18n/server";

/** Where the payment stands: still waiting, not paid in time, or what it did to the plan. */
export async function PaymentOutcome({ transaction }: { transaction: Transaction }) {
  const { t, format } = await getI18n();
  const text = t.payments.detail;
  const date = (value: string) => format.dateTime(value, { seconds: false });

  if (transaction.status === "pending") {
    return (
      <Alert tone="info" title={text.pendingTitle} icon={<Spinner />} role="status">
        {text.pending(date(transaction.expires_at))}
      </Alert>
    );
  }
  if (transaction.status === "expired") {
    return (
      <Alert tone="neutral" title={text.expiredTitle}>
        {text.expired(date(transaction.expires_at))}
      </Alert>
    );
  }

  const { grant } = transaction;
  let outcome: string;
  if (!grant) {
    // Paid before wau-billing recorded what payments do.
    outcome = text.outcome.unrecorded(date(transaction.paid_at ?? transaction.create_date));
  } else if (!grant.starts_at || !grant.ends_at) {
    outcome = text.outcome.extendNoTime(transaction.tier_name, grant.tier_name);
  } else if (grant.kind === "extend") {
    outcome = text.outcome.extend(transaction.tier_name, grant.tier_name, date(grant.starts_at), date(grant.ends_at));
  } else {
    outcome = text.outcome[grant.kind](grant.tier_name, date(grant.starts_at), date(grant.ends_at));
  }
  return (
    <Alert tone="positive" title={text.paidTitle}>
      {outcome}
    </Alert>
  );
}
