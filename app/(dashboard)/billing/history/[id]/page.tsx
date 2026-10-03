import { ArrowLeft } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { DescriptionList, type DescriptionItem } from "@/components/ui/description-list";
import { PageHeader } from "@/components/ui/page-header";
import { SecretValue } from "@/components/ui/secret-value";
import { getTransaction } from "@/lib/api/billing";
import { ApiError } from "@/lib/api/client";
import type { Transaction } from "@/lib/api/types";
import { tierTone, transactionStatusTone } from "@/lib/billing";
import { getI18n } from "@/lib/i18n/server";
import { PaymentOutcome } from "./_components/payment-outcome";
import { PendingRefresh } from "./_components/pending-refresh";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.payments.detail.metaTitle };
}

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function loadTransaction(id: string): Promise<Transaction> {
  try {
    return await getTransaction(id);
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) notFound();
    throw error;
  }
}

/** One payment: where it stands, what it did to the plan, and the codes to quote about it. */
export default async function PaymentPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!UUID.test(id)) notFound();

  const [{ t, format }, transaction] = await Promise.all([getI18n(), loadTransaction(id)]);
  const text = t.payments.detail;
  const { statuses, periods } = t.payments;
  const date = (value: string) => format.dateTime(value, { seconds: false });
  const { grant } = transaction;

  const details: DescriptionItem[] = [
    { label: text.details.plan, value: <Badge tone={tierTone(transaction.tier_id)}>{transaction.tier_name}</Badge> },
    { label: text.details.period, value: periods[transaction.period] },
    { label: text.details.amount, value: format.number(transaction.amount, { style: "currency", currency: "VND" }) },
    {
      label: text.details.status,
      value: (
        <Badge tone={transactionStatusTone[transaction.status] ?? "neutral"} dot>
          {statuses[transaction.status] ?? transaction.status}
        </Badge>
      ),
    },
    { label: text.details.created, value: date(transaction.create_date) },
    transaction.status === "succeeded"
      ? { label: text.details.paidAt, value: transaction.paid_at ? date(transaction.paid_at) : "—" }
      : {
          label: transaction.status === "pending" ? text.details.deadline : text.details.deadlinePassed,
          value: date(transaction.expires_at),
        },
  ];

  const references: DescriptionItem[] = [
    { label: text.references.code, value: <SecretValue value={transaction.payment_code} aria-label={text.references.code} /> },
    { label: text.references.id, value: <SecretValue value={transaction.id} aria-label={text.references.id} /> },
  ];
  if (transaction.sepay_transaction_id) {
    references.push({
      label: text.references.sepay,
      value: <SecretValue value={transaction.sepay_transaction_id} aria-label={text.references.sepay} />,
    });
  }

  return (
    <>
      <PageHeader
        level={2}
        title={text.title(transaction.tier_name, periods[transaction.period])}
        description={text.created(date(transaction.create_date))}
        actions={
          <Link href="/billing/history" className={buttonVariants({ variant: "outline", size: "sm" })}>
            <ArrowLeft /> {text.back}
          </Link>
        }
      >
        <Badge tone={transactionStatusTone[transaction.status] ?? "neutral"} dot>
          {statuses[transaction.status] ?? transaction.status}
        </Badge>
      </PageHeader>

      <PaymentOutcome transaction={transaction} />
      {transaction.status === "pending" && <PendingRefresh until={transaction.expires_at} />}

      <Card>
        <CardHeader>
          <CardTitle>{text.details.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <DescriptionList columns={3} items={details} />
        </CardContent>
      </Card>

      {grant && (
        <Card>
          <CardHeader>
            <CardTitle>{text.grant.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <DescriptionList
              columns={3}
              items={[
                { label: text.grant.change, value: text.grant.kinds[grant.kind] },
                { label: text.grant.plan, value: <Badge tone={tierTone(grant.tier_id)}>{grant.tier_name}</Badge> },
                {
                  label: text.grant.time,
                  value:
                    grant.starts_at && grant.ends_at ? text.grant.span(date(grant.starts_at), date(grant.ends_at)) : text.grant.noTime,
                },
              ]}
            />
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="min-w-0">
            <CardTitle>{text.references.title}</CardTitle>
            <CardDescription>{text.references.description}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <DescriptionList columns={1} items={references} />
        </CardContent>
      </Card>
    </>
  );
}
