"use client";

import { KeyRound } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useI18n } from "@/lib/i18n/client";

export default function KeyNotFound() {
  const text = useI18n().t.keyDetail.notFound;

  return (
    <EmptyState
      icon={<KeyRound />}
      title={text.title}
      description={text.description}
      action={
        <Link href="/keys" className={buttonVariants({ variant: "outline" })}>
          {text.back}
        </Link>
      }
    />
  );
}
