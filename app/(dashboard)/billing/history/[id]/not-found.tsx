"use client";

import { ReceiptText } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useI18n } from "@/lib/i18n/client";

export default function PaymentNotFound() {
  const text = useI18n().t.payments.detail.notFound;

  return (
    <EmptyState
      icon={<ReceiptText />}
      title={text.title}
      description={text.description}
      action={
        <Link href="/billing/history" className={buttonVariants({ variant: "outline" })}>
          {text.back}
        </Link>
      }
    />
  );
}
