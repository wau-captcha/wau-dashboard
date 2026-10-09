import type { Metadata } from "next";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { buttonVariants } from "@/components/ui/button";
import { PageHeader } from "@/components/ui/page-header";
import { PlanTable, type PlanColumn, type PlanRow } from "@/components/ui/plan-table";
import { listPublicPlans, type PublicPlan } from "@/lib/api/plans";
import { challengeTypeLabel } from "@/lib/challenge-types";
import { getI18n } from "@/lib/i18n/server";
import { Bullets, SubHeading } from "../docs/_components/doc-section";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.trust.pricing.metaTitle, description: t.trust.pricing.metaDescription };
}

/** The plans as the billing page sells them, for anyone; tenant's answer is reused for five minutes. */
export default async function PricingPage() {
  const [{ t, format }, plans] = await Promise.all([getI18n(), listPublicPlans().catch(() => null)]);
  const text = t.trust.pricing;
  const vnd = (amount: number) => format.number(amount, { style: "currency", currency: "VND" });
  const byPlan = (value: (plan: PublicPlan) => string) => Object.fromEntries((plans ?? []).map((plan) => [plan.id, value(plan)]));

  const columns: PlanColumn[] = (plans ?? []).map((plan) => {
    const paid = plan.monthly_price > 0;
    return {
      id: plan.id,
      name: plan.name,
      price: paid ? vnd(plan.monthly_price) : text.free,
      priceNote: paid ? `${text.perMonth} · ${plan.yearly_price > 0 ? text.perYear(vnd(plan.yearly_price)) : text.monthlyOnly}` : undefined,
      action: (
        <Link href={paid ? "/billing" : "/login"} className={buttonVariants({ variant: paid ? "primary" : "outline", size: "sm" })}>
          {paid ? text.actions.paid : text.actions.free}
        </Link>
      ),
    };
  });
  const rows: PlanRow[] = [
    {
      id: "quota",
      label: text.rows.quota,
      hint: text.rows.quotaHint,
      values: byPlan((plan) => text.rows.quotaValue(format.number(plan.daily_quota))),
    },
    {
      id: "types",
      label: text.rows.types,
      values: byPlan((plan) => plan.challenge_types.map((id) => challengeTypeLabel(id, t.challengeTypes)).join(", ")),
    },
    {
      id: "payment",
      label: text.rows.payment,
      values: byPlan((plan) => (plan.monthly_price > 0 ? text.rows.paymentValue : text.rows.noPayment)),
    },
  ];

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-10 sm:px-6 sm:py-14">
      <PageHeader title={text.title} description={text.description} />
      {plans && plans.length > 0 ? (
        <PlanTable aria-label={text.tableLabel} plans={columns} rows={rows} />
      ) : (
        <Alert tone="negative">{text.unavailable}</Alert>
      )}
      <section className="grid gap-3">
        <SubHeading>{text.notesTitle}</SubHeading>
        <Bullets items={text.notes} />
      </section>
    </div>
  );
}
