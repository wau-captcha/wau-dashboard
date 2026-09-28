import { Badge } from "@/components/ui/badge";
import { tierTone } from "@/lib/billing";
import { getI18n } from "@/lib/i18n/server";

export type PlanBadgeProps = {
  tierId: string;
  tierName: string;
  /** When a paid plan ends; nothing is shown for a plan with no end date. */
  expiresAt?: string | null;
};

/** The plan of an account, and when it ends. */
export async function PlanBadge({ tierId, tierName, expiresAt }: PlanBadgeProps) {
  const { t, format } = await getI18n();
  return (
    <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
      <Badge tone={tierTone(tierId)}>{tierName}</Badge>
      {expiresAt && (
        <span className="text-muted-foreground">{t.account.info.planUntil(format.dateTime(expiresAt, { seconds: false }))}</span>
      )}
    </span>
  );
}
