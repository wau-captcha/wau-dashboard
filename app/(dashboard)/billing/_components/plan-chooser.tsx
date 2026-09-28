"use client";

import { Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/dialog";
import { PlanTable, type PlanColumn, type PlanRow } from "@/components/ui/plan-table";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { toast } from "@/components/ui/toast";
import type { BillingPeriod, Checkout, Plan, PlanSet } from "@/lib/api/types";
import { PERIOD_MONTHS, addMonths, daysUntil, priceFor, yearlySaving } from "@/lib/billing";
import { challengeTypeLabel } from "@/lib/challenge-types";
import { useI18n } from "@/lib/i18n/client";
import { startCheckoutAction } from "../actions";

/** Posts the signed fields to SePay in their order, which the signature depends on. */
function submitToSepay(actionUrl: string, fields: Checkout["fields"]) {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = actionUrl;
  form.hidden = true;
  for (const field of fields) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = field.name;
    input.value = field.value;
    form.append(input);
  }
  document.body.append(form);
  form.submit();
}

type Choice = { plan: Plan; period: BillingPeriod };

/**
 * The plans side by side, priced by the month or by the year; buying one confirms the terms, then
 * leaves for SePay's payment page.
 */
export function PlanChooser({ planSet }: { planSet: PlanSet }) {
  const { t, format } = useI18n();
  const text = t.billing;
  const router = useRouter();
  const [period, setPeriod] = useState<BillingPeriod>("month");
  const [chosen, setChosen] = useState<Choice | null>(null);
  const [leavingFor, setLeavingFor] = useState<string | null>(null);
  const current = planSet.plans.find((plan) => plan.tier_id === planSet.current_tier_id);
  const vnd = (amount: number) => format.number(amount, { style: "currency", currency: "VND" });
  const when = (value: string | Date) => format.dateTime(value, { seconds: false });
  const sellsYearly = planSet.plans.some((plan) => plan.monthly_price > 0 && plan.yearly_price > 0);
  const savings = planSet.plans.map(yearlySaving).filter((saving) => saving !== null);
  const bestSaving = savings.length > 0 ? Math.max(...savings) : null;

  // The Back button from SePay restores this page from the cache, still leaving.
  useEffect(() => {
    const restore = (event: PageTransitionEvent) => {
      if (event.persisted) setLeavingFor(null);
    };
    window.addEventListener("pageshow", restore);
    return () => window.removeEventListener("pageshow", restore);
  }, []);

  async function pay() {
    if (!chosen) return;
    const result = await startCheckoutAction(chosen.plan.tier_id, chosen.period);
    if (!result.actionUrl || !result.fields) {
      toast.error(result.error ?? t.errors.generic);
      // The plan may have changed in another tab; show what can be bought now.
      router.refresh();
      return;
    }
    setLeavingFor(chosen.plan.tier_id);
    submitToSepay(result.actionUrl, result.fields);
  }

  function action(plan: Plan) {
    const isCurrent = plan.tier_id === planSet.current_tier_id;
    if (!plan.purchase) {
      return isCurrent ? (
        <Button variant="outline" size="sm" disabled startIcon={<Check />}>
          {text.plans.actions.current}
        </Button>
      ) : null;
    }
    if (priceFor(plan, period) <= 0) return null;
    const upgrade = plan.purchase === "upgrade";
    return (
      <Button
        variant={upgrade ? "primary" : "outline"}
        size="sm"
        loading={leavingFor === plan.tier_id}
        disabled={leavingFor !== null}
        onClick={() => setChosen({ plan, period })}
      >
        {upgrade ? text.plans.actions.upgrade : text.plans.actions.renew[period]}
      </Button>
    );
  }

  /** The price line of a plan for the period shown, with what a year saves. */
  function price(plan: Plan): Pick<PlanColumn, "price" | "priceNote" | "priceBadge"> {
    if (period === "month" || plan.monthly_price <= 0) {
      return { price: vnd(plan.monthly_price), priceNote: text.plans.per[period] };
    }
    if (plan.yearly_price <= 0) return { price: vnd(plan.monthly_price), priceNote: text.plans.notSoldYearly };
    const saving = yearlySaving(plan);
    return {
      price: vnd(plan.yearly_price),
      priceNote: text.plans.perYearMonthly(vnd(Math.round(plan.yearly_price / 12))),
      priceBadge:
        saving === null ? undefined : (
          <Badge tone="positive" size="sm">
            {text.plans.save(format.percent(saving))}
          </Badge>
        ),
    };
  }

  const byPlan = (value: (plan: Plan) => string) =>
    Object.fromEntries(planSet.plans.map((plan) => [plan.tier_id, value(plan)]));
  const columns: PlanColumn[] = planSet.plans.map((plan) => ({
    id: plan.tier_id,
    name: plan.tier_name,
    highlighted: plan.tier_id === planSet.current_tier_id,
    badge:
      plan.tier_id === planSet.current_tier_id ? (
        <Badge tone="primary" size="sm">
          {text.plans.current}
        </Badge>
      ) : undefined,
    ...price(plan),
    action: action(plan),
  }));
  const rows: PlanRow[] = [
    {
      id: "quota",
      label: text.plans.rows.quota,
      hint: text.plans.rows.quotaHint,
      values: byPlan((plan) => text.plans.rows.quotaValue(format.number(plan.daily_quota))),
    },
    {
      id: "types",
      label: text.plans.rows.types,
      values: byPlan((plan) => plan.challenge_types.map((id) => challengeTypeLabel(id, t.challengeTypes)).join(", ")),
    },
    {
      id: "payment",
      label: text.plans.rows.payment,
      values: byPlan((plan) => (plan.monthly_price > 0 ? text.plans.rows.paymentValue : text.plans.rows.noPayment)),
    },
  ];

  const chosenPeriod = chosen?.period ?? "month";
  const upgrade = chosen?.plan.purchase === "upgrade";
  const expiresAt = planSet.current_tier_expires_at;
  const months = PERIOD_MONTHS[chosenPeriod];
  const chosenSaving = chosen && chosenPeriod === "year" ? yearlySaving(chosen.plan) : null;
  const dropsDays = upgrade && current && current.monthly_price > 0 && expiresAt ? daysUntil(expiresAt) : 0;

  return (
    <>
      {sellsYearly && (
        <div className="flex flex-wrap items-center gap-3">
          <SegmentedControl
            aria-label={text.plans.periodLabel}
            options={[
              { value: "month", label: text.plans.periods.month },
              { value: "year", label: text.plans.periods.year },
            ]}
            value={period}
            onValueChange={setPeriod}
          />
          {bestSaving !== null && <Badge tone="positive">{text.plans.saveUpTo(format.percent(bestSaving))}</Badge>}
        </div>
      )}
      <PlanTable aria-label={text.plans.tableLabel} plans={columns} rows={rows} />
      <ConfirmDialog
        open={chosen !== null}
        onOpenChange={(open) => {
          if (!open) setChosen(null);
        }}
        title={chosen ? (upgrade ? text.confirm.upgradeTitle(chosen.plan.tier_name) : text.confirm.renewTitle[chosenPeriod](chosen.plan.tier_name)) : ""}
        description={chosen ? text.confirm.pay[chosenPeriod](vnd(priceFor(chosen.plan, chosenPeriod))) : undefined}
        confirmLabel={text.confirm.continue}
        onConfirm={pay}
      >
        {chosen && (
          <div className="grid gap-2 text-body text-muted-foreground">
            {upgrade ? (
              <p>{text.confirm.upgradeRuns[chosenPeriod](chosen.plan.tier_name, when(addMonths(new Date(), months)))}</p>
            ) : (
              expiresAt && <p>{text.confirm.renewEnds(chosen.plan.tier_name, when(addMonths(expiresAt, months)))}</p>
            )}
            {chosenSaving !== null && (
              <p>{text.confirm.saving(format.percent(chosenSaving), vnd(chosen.plan.monthly_price * 12))}</p>
            )}
            {dropsDays > 0 && current && <p>{text.confirm.dropped(current.tier_name, dropsDays)}</p>}
          </div>
        )}
      </ConfirmDialog>
    </>
  );
}
