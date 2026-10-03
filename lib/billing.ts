import type { BadgeTone } from "@/components/ui/badge";
import type { BillingPeriod, Plan, TransactionStatus } from "@/lib/api/types";

/** Paid plans wear the accent badge, the free one the neutral badge. */
export function tierTone(tierId: string): BadgeTone {
  return tierId === "free" ? "neutral" : "primary";
}

/** The badge of a payment: waiting is a warning, paid is positive, an unpaid checkout is neutral. */
export const transactionStatusTone: Record<TransactionStatus, BadgeTone> = {
  pending: "warning",
  succeeded: "positive",
  expired: "neutral",
};

/** Months of a plan are counted in Asia/Ho_Chi_Minh, which is UTC+7 all year. */
const ZONE_OFFSET_MS = 7 * 60 * 60 * 1000;

/** Calendar months one purchase of each period adds. */
export const PERIOD_MONTHS: Record<BillingPeriod, number> = { month: 1, year: 12 };

/** The price of one period of a plan; 0 when the plan is not sold for that period. */
export function priceFor(plan: Plan, period: BillingPeriod): number {
  return period === "year" ? plan.yearly_price : plan.monthly_price;
}

/**
 * What paying yearly saves against 12 monthly payments, as a ratio (0.167 for 16.7%); null when
 * the plan is not sold both ways or the year costs no less.
 */
export function yearlySaving(plan: Plan): number | null {
  const twelveMonths = plan.monthly_price * 12;
  if (plan.monthly_price <= 0 || plan.yearly_price <= 0 || plan.yearly_price >= twelveMonths) return null;
  return 1 - plan.yearly_price / twelveMonths;
}

/**
 * The same local time months later, clamped to the last day of a shorter month (31 January plus
 * a month is 28 February): how wau-billing counts months, repeated here to show dates before paying.
 */
export function addMonths(value: string | Date, months: number): Date {
  const local = new Date(new Date(value).getTime() + ZONE_OFFSET_MS);
  const year = local.getUTCFullYear();
  const month = local.getUTCMonth();
  const lastDay = new Date(Date.UTC(year, month + months + 1, 0)).getUTCDate();
  const moved = Date.UTC(
    year,
    month + months,
    Math.min(local.getUTCDate(), lastDay),
    local.getUTCHours(),
    local.getUTCMinutes(),
    local.getUTCSeconds(),
    local.getUTCMilliseconds(),
  );
  return new Date(moved - ZONE_OFFSET_MS);
}

/** Whole days until `value`, counting a started day; 0 once it has passed. */
export function daysUntil(value: string | Date, now = Date.now()): number {
  return Math.max(0, Math.ceil((new Date(value).getTime() - now) / 86_400_000));
}
