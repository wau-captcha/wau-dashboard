import "server-only";

import { apiFetch } from "./client";
import { toNumber } from "./usage";

/** A plan as the public pricing page shows it. */
export type PublicPlan = {
  id: string;
  name: string;
  description: string;
  /** VND for one month; 0 for a plan that is not sold (free). */
  monthly_price: number;
  /** VND for one year; 0 when the plan is not sold by the year. */
  yearly_price: number;
  daily_quota: number;
  challenge_types: string[];
};

type RawPlan = Omit<PublicPlan, "monthly_price" | "yearly_price" | "daily_quota" | "challenge_types"> & {
  monthly_price?: string | number;
  yearly_price?: string | number;
  daily_quota?: string | number;
  challenge_types?: string[];
};

/** Plans change rarely, so one answer of tenant serves every visitor for five minutes. */
const PLANS_REVALIDATE_SECONDS = 300;

/** The active plans, cheapest first. Needs no session. */
export async function listPublicPlans(): Promise<PublicPlan[]> {
  const raw = await apiFetch<{ plans?: RawPlan[] }>("/v1/plans", { auth: false, revalidate: PLANS_REVALIDATE_SECONDS });
  return (raw.plans ?? []).map((plan) => ({
    ...plan,
    description: plan.description ?? "",
    monthly_price: toNumber(plan.monthly_price),
    yearly_price: toNumber(plan.yearly_price),
    daily_quota: toNumber(plan.daily_quota),
    challenge_types: plan.challenge_types ?? [],
  }));
}
