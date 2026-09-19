"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { Tabs, TabsList, TabsTab } from "@/components/ui/tabs";
import { useI18n } from "@/lib/i18n/client";
import { USAGE_RANGES } from "@/lib/usage-view";

/** Switches the usage window by rewriting the query string. */
export function RangeTabs({ value }: { value: number }) {
  const text = useI18n().t.usage.range;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, startTransition] = useTransition();

  function select(days: string) {
    const params = new URLSearchParams(searchParams);
    params.set("days", days);
    startTransition(() => router.replace(`${pathname}?${params.toString()}`, { scroll: false }));
  }

  return (
    <Tabs
      variant="segmented"
      value={String(value)}
      onValueChange={(next) => select(String(next))}
      className={pending ? "opacity-60 transition-opacity" : undefined}
    >
      <TabsList aria-label={text.label}>
        {USAGE_RANGES.map((days) => (
          <TabsTab key={days} value={String(days)}>
            {text.days(days)}
          </TabsTab>
        ))}
      </TabsList>
    </Tabs>
  );
}
