"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import { APPEAL_FILTERS, type AppealFilter } from "@/lib/appeal-filters";
import { useI18n } from "@/lib/i18n/client";

/** Switches the appeals listed, `?status=pending` to `?status=all`, by rewriting the query string. */
export function AppealStatusTabs({ value }: { value: AppealFilter }) {
  const text = useI18n().t.appeals;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  function select(status: string) {
    const params = new URLSearchParams(searchParams);
    params.set("status", status);
    startTransition(() => router.replace(`${pathname}?${params.toString()}`, { scroll: false }));
  }

  return (
    <Tabs
      variant="segmented"
      value={value}
      onValueChange={(next) => select(String(next))}
      className={pending ? "opacity-60 transition-opacity" : undefined}
    >
      <TabsList aria-label={text.filterLabel}>
        {APPEAL_FILTERS.map((status) => (
          <TabsTab key={status} value={status}>
            {text.statuses[status]}
          </TabsTab>
        ))}
      </TabsList>
    </Tabs>
  );
}
