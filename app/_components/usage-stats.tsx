"use client";

import { Activity, CircleCheck, Gauge } from "lucide-react";
import { StatCard } from "@/components/ui/card";
import type { UsageCount } from "@/lib/api/types";
import { useI18n } from "@/lib/i18n/client";
import { usageTotals } from "@/lib/usage-view";

/**
 * The three usage tiles of a window: right answers (the usage counted against the quota), then
 * (/challenge/verify)/(/challenge/new) next to right answers over all verifications.
 */
export function UsageStatCards({ usage }: { usage: UsageCount }) {
  const { t, format } = useI18n();
  const text = t.usage.stats;
  const totals = usageTotals(usage, format);
  return (
    <>
      <StatCard label={text.solves} value={totals.successes} hint={text.solvesHint(totals.verifications)} icon={<Activity />} />
      <StatCard
        label={text.verifyRate}
        value={totals.verifyRate}
        hint={text.verifyRateHint(totals.verifications, totals.challenges)}
        icon={<Gauge />}
      />
      <StatCard
        label={text.successRate}
        value={totals.successRate}
        hint={text.successRateHint(totals.successes, totals.verifications)}
        icon={<CircleCheck />}
      />
    </>
  );
}
