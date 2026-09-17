"use client";

import { useOptimistic, useTransition } from "react";
import { useLocale, useUIText } from "@/components/ui/locale";
import { SegmentedControl, type SegmentedOption } from "@/components/ui/segmented-control";
import { setLocaleAction } from "@/lib/i18n/actions";
import { LOCALE_NAMES, LOCALES, type Locale } from "@/lib/i18n/config";
import { cn } from "@/lib/utils";

const options: SegmentedOption<Locale>[] = LOCALES.map((locale) => ({
  value: locale,
  label: locale.toUpperCase(),
  ariaLabel: LOCALE_NAMES[locale],
  title: LOCALE_NAMES[locale],
}));

/** EN · VI switch. The choice is stored in a cookie and the current page re-renders in place. */
export function LanguageSwitcher({ className }: { className?: string }) {
  const locale = useLocale();
  const text = useUIText().language;
  const [shown, setShown] = useOptimistic(locale);
  const [pending, startTransition] = useTransition();

  function select(next: Locale) {
    startTransition(async () => {
      setShown(next);
      await setLocaleAction(next);
    });
  }

  return (
    <div data-slot="language-switcher" className={cn("inline-flex", className)}>
      <SegmentedControl
        aria-label={text.group}
        options={options}
        value={shown}
        onValueChange={select}
        disabled={pending}
      />
    </div>
  );
}
