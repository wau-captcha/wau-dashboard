import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { listTransactions } from "@/lib/api/billing";
import { getI18n } from "@/lib/i18n/server";
import { TransactionsTable } from "./_components/transactions-table";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.payments.metaTitle, description: t.payments.metaDescription };
}

export default async function PaymentHistoryPage() {
  const [{ t }, transactions] = await Promise.all([getI18n(), listTransactions()]);
  const text = t.payments.list;

  return (
    <Card>
      <CardHeader>
        <div className="min-w-0">
          <CardTitle>{text.title}</CardTitle>
          <CardDescription>{text.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <TransactionsTable transactions={transactions} />
      </CardContent>
    </Card>
  );
}
