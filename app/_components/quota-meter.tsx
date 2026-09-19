import { Alert } from "@/components/ui/alert";
import { Meter } from "@/components/ui/meter";
import { getI18n } from "@/lib/i18n/server";

export type QuotaMeterProps = {
  used: number;
  limit: number;
  /** Minutes until the count starts over; omitted, the meter does not say. */
  minutesToReset?: number;
  title?: string;
};

/** Today's successful verifications against the daily quota of the tier. */
export async function QuotaMeter({ used, limit, minutesToReset, title }: QuotaMeterProps) {
  const { t, format } = await getI18n();
  const text = t.usage.quota;
  const count = text.count(format.number(used), format.number(limit));

  return (
    <div className="grid gap-4">
      <Meter
        label={title ?? text.title}
        value={used}
        max={limit}
        description={
          minutesToReset === undefined ? undefined : text.resetsIn(Math.floor(minutesToReset / 60), minutesToReset % 60)
        }
        valueLabel={text.used(format.percent(limit > 0 ? Math.min(1, used / limit) : 1))}
        caption={count}
        valueText={count}
      />
      {used >= limit && <Alert tone="warning">{text.full}</Alert>}
    </div>
  );
}
