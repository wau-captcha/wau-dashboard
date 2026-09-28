"use client";

import { Check, Minus } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { useUIText } from "./locale";
import { SegmentedControl } from "./segmented-control";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./table";

export type PlanColumn = {
  id: string;
  /** Short name; also the label of the plan switch on phones. */
  name: string;
  /** Badge after the name, e.g. "Current". */
  badge?: ReactNode;
  /** The price, or another short line under the name. */
  price?: ReactNode;
  /** Badge after the price, e.g. what paying yearly saves. */
  priceBadge?: ReactNode;
  /** Small line under the price, e.g. "per month". */
  priceNote?: ReactNode;
  /** Draws the name in the accent color, e.g. for the viewer's plan. */
  highlighted?: boolean;
  /** The plan's button. */
  action?: ReactNode;
};

export type PlanRow = {
  id: string;
  label: ReactNode;
  /** Smaller line under the label. */
  hint?: ReactNode;
  /** A value per plan id; true and false render as a check and a dash. */
  values: Record<string, ReactNode | boolean>;
};

export type PlanTableProps = {
  plans: PlanColumn[];
  rows: PlanRow[];
  "aria-label": string;
  /** The plan phones show first; defaults to the first highlighted plan. */
  defaultPlanId?: string;
  className?: string;
};

/**
 * Plans side by side, one column each with its price and button, features as rows. Phones get
 * one plan at a time behind a switch.
 */
export function PlanTable({ plans, rows, defaultPlanId, className, "aria-label": ariaLabel }: PlanTableProps) {
  const text = useUIText();
  const [phonePlanId, setPhonePlanId] = useState(
    defaultPlanId ?? plans.find((plan) => plan.highlighted)?.id ?? plans[0]?.id ?? "",
  );
  const phonePlan = plans.find((plan) => plan.id === phonePlanId) ?? plans[0];

  function value(row: PlanRow, planId: string) {
    const entry = row.values[planId];
    if (entry === true || entry === false) {
      const Icon = entry ? Check : Minus;
      return (
        <>
          <Icon aria-hidden className={cn("mx-auto size-4", entry ? "text-positive-text" : "text-muted-foreground")} />
          <span className="sr-only">{entry ? text.table.yes : text.table.no}</span>
        </>
      );
    }
    return entry;
  }

  function label(row: PlanRow) {
    return (
      <span className="grid gap-0.5">
        <span>{row.label}</span>
        {row.hint && <span className="text-overline font-normal text-muted-foreground">{row.hint}</span>}
      </span>
    );
  }

  function heading(plan: PlanColumn, align: "center" | "left") {
    return (
      <span className={cn("grid gap-1", align === "center" && "justify-items-center")}>
        <span className="flex flex-wrap items-center gap-2">
          <span className={cn("text-section font-semibold", plan.highlighted ? "text-accent-foreground" : "text-foreground")}>
            {plan.name}
          </span>
          {plan.badge}
        </span>
        {plan.price && (
          <span className={cn("flex flex-wrap items-center gap-x-2 gap-y-1", align === "center" && "justify-center")}>
            <span className="text-heading font-medium text-foreground tabular-nums">{plan.price}</span>
            {plan.priceBadge}
          </span>
        )}
        {plan.priceNote && <span className="text-overline font-normal text-muted-foreground">{plan.priceNote}</span>}
      </span>
    );
  }

  return (
    <div data-slot="plan-table" className={cn("min-w-0", className)}>
      <Table aria-label={ariaLabel} className="table-fixed" containerClassName="max-md:hidden">
        <TableHeader>
          <TableRow>
            <TableHead scope="col" className="border-b-0 pt-4 pb-0">
              <span className="sr-only">{ariaLabel}</span>
            </TableHead>
            {plans.map((plan) => (
              <TableHead key={plan.id} scope="col" className="border-b-0 pt-4 pb-0 text-center align-top whitespace-normal">
                {heading(plan, "center")}
              </TableHead>
            ))}
          </TableRow>
          <TableRow>
            <TableCell className="pt-2 pb-4" />
            {plans.map((plan) => (
              <TableCell key={plan.id} className="pt-2 pb-4 text-center">
                {plan.action}
              </TableCell>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.id}>
              <th scope="row" className="border-b border-border px-4 py-2.5 text-left align-middle font-medium text-foreground [tr:last-child>&]:border-b-0">
                {label(row)}
              </th>
              {plans.map((plan) => (
                <TableCell key={plan.id} className="text-center whitespace-normal text-balance text-foreground">
                  {value(row, plan.id)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {phonePlan && (
        <div className="grid gap-4 md:hidden">
          <SegmentedControl
            aria-label={ariaLabel}
            options={plans.map((plan) => ({ value: plan.id, label: plan.name }))}
            value={phonePlan.id}
            onValueChange={setPhonePlanId}
            className="w-full [&>*]:flex-1"
          />
          <div className="grid gap-3">
            {heading(phonePlan, "left")}
            {phonePlan.action && <div className="grid [&>*]:w-full">{phonePlan.action}</div>}
          </div>
          <Table aria-label={phonePlan.name}>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <th scope="row" className="border-b border-border px-4 py-2.5 text-left align-middle font-medium text-foreground [tr:last-child>&]:border-b-0">
                    {label(row)}
                  </th>
                  <TableCell className="text-right whitespace-normal text-foreground [&_svg]:ml-auto [&_svg]:mr-0">
                    {value(row, phonePlan.id)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
