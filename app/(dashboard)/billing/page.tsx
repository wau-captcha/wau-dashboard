import type { Metadata } from "next";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DescriptionList } from "@/components/ui/description-list";
import { PageHeader } from "@/components/ui/page-header";
import { listPlans } from "@/lib/api/billing";
import { daysUntil, tierTone } from "@/lib/billing";
import { getI18n } from "@/lib/i18n/server";
import { CheckoutResult, type CheckoutReturn } from "./_components/checkout-result";
import { PlanChooser } from "./_components/plan-chooser";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.billing.metaTitle, description: t.billing.metaDescription };
}

/** A plan this close to its end gets a reminder to renew it. */
const REMIND_DAYS = 7;

const returns: CheckoutReturn[] = ["success", "cancel", "error"];

export default async function BillingPage({
  searchParams,
}: {
  searchParams: Promise<{ transaction?: string; result?: string }>;
}) {
  const [{ t, format }, planSet, params] = await Promise.all([getI18n(), listPlans(), searchParams]);
  const text = t.billing;
  const current = planSet.plans.find((plan) => plan.tier_id === planSet.current_tier_id);
  const expiresAt = planSet.current_tier_expires_at;
  const result = returns.find((value) => value === params.result);
  const endsSoon = current && expiresAt && daysUntil(expiresAt) <= REMIND_DAYS;

  return (
    <>
      {params.transaction && result && <CheckoutResult transactionId={params.transaction} result={result} />}

      <Card>
        <CardHeader>
          <CardTitle>{text.current.title}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4">
          <DescriptionList
            columns={3}
            items={[
              {
                label: text.current.plan,
                value: <Badge tone={tierTone(planSet.current_tier_id)}>{current?.tier_name ?? planSet.current_tier_id}</Badge>,
              },
              {
                label: text.current.ends,
                value: expiresAt ? format.dateTime(expiresAt, { seconds: false }) : text.current.never,
              },
              {
                label: text.current.quota,
                value: current ? text.current.quotaValue(format.number(current.daily_quota)) : "—",
              },
            ]}
          />
          {endsSoon && (
            <Alert tone="warning">{text.current.endingSoon(current.tier_name, format.dateTime(expiresAt, { seconds: false }))}</Alert>
          )}
        </CardContent>
      </Card>

      <section className="grid gap-4">
        <PageHeader level={2} title={text.plans.title} description={text.plans.description} />
        <PlanChooser planSet={planSet} />
        <Alert tone="neutral">{text.plans.rules}</Alert>
      </section>
    </>
  );
}
