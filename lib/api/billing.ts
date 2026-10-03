import "server-only";

import { apiFetch } from "./client";
import type { BillingPeriod, Checkout, GrantKind, Plan, PlanGrant, PlanSet, Purchase, Transaction, TransactionStatus } from "./types";
import { toNumber } from "./usage";

/** int64 fields arrive as strings in proto JSON; unset timestamps arrive as null. */
type RawPlan = Omit<Plan, "monthly_price" | "yearly_price" | "daily_quota" | "purchase" | "challenge_types"> & {
  monthly_price?: string | number;
  yearly_price?: string | number;
  daily_quota?: string | number;
  challenge_types?: string[];
  purchase?: string;
};
type RawGrant = Omit<PlanGrant, "kind" | "starts_at" | "ends_at"> & {
  kind: string;
  starts_at?: string | null;
  ends_at?: string | null;
};
type RawTransaction = Omit<Transaction, "amount" | "period" | "status" | "paid_at" | "sepay_transaction_id" | "grant"> & {
  amount?: string | number;
  period?: string;
  status: string;
  paid_at?: string | null;
  sepay_transaction_id?: string;
  grant?: RawGrant | null;
};

const GRANT_KINDS: readonly GrantKind[] = ["upgrade", "renew", "extend"];

function isGrantKind(kind: string): kind is GrantKind {
  return (GRANT_KINDS as readonly string[]).includes(kind);
}

/** A grant of a kind this dashboard does not know is left out rather than mislabelled. */
function toGrant(raw: RawGrant | null | undefined): PlanGrant | null {
  if (!raw || !isGrantKind(raw.kind)) return null;
  return { ...raw, kind: raw.kind, starts_at: raw.starts_at ?? null, ends_at: raw.ends_at ?? null };
}

function toPlan(raw: RawPlan): Plan {
  return {
    ...raw,
    monthly_price: toNumber(raw.monthly_price),
    yearly_price: toNumber(raw.yearly_price),
    daily_quota: toNumber(raw.daily_quota),
    challenge_types: raw.challenge_types ?? [],
    purchase: (raw.purchase ?? "") as Purchase,
  };
}

function toTransaction(raw: RawTransaction): Transaction {
  return {
    ...raw,
    amount: toNumber(raw.amount),
    period: raw.period === "year" ? "year" : "month",
    status: raw.status as TransactionStatus,
    paid_at: raw.paid_at ?? null,
    sepay_transaction_id: raw.sepay_transaction_id ?? "",
    grant: toGrant(raw.grant),
  };
}

export async function listPlans(): Promise<PlanSet> {
  const raw = await apiFetch<{ plans?: RawPlan[]; current_tier_id: string; current_tier_expires_at?: string | null }>(
    "/v1/billing/plans",
  );
  return {
    plans: (raw.plans ?? []).map(toPlan),
    current_tier_id: raw.current_tier_id,
    current_tier_expires_at: raw.current_tier_expires_at ?? null,
  };
}

/** Opens a pending transaction for one month or one year of the tier at today's price. */
export async function createCheckout(tierId: string, period: BillingPeriod): Promise<Checkout> {
  const raw = await apiFetch<{ transaction: RawTransaction; action_url: string; fields?: Checkout["fields"] }>(
    "/v1/billing/checkout",
    { method: "POST", body: { tier_id: tierId, period } },
  );
  return { transaction: toTransaction(raw.transaction), action_url: raw.action_url, fields: raw.fields ?? [] };
}

/** The latest 50, newest first. */
export async function listTransactions(): Promise<Transaction[]> {
  const raw = await apiFetch<{ transactions?: RawTransaction[] }>("/v1/billing/transactions");
  return (raw.transactions ?? []).map(toTransaction);
}

export async function getTransaction(id: string): Promise<Transaction> {
  return toTransaction(await apiFetch<RawTransaction>(`/v1/billing/transactions/${encodeURIComponent(id)}`));
}
