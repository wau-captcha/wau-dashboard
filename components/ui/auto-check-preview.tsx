"use client";

import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { useUIText } from "./locale";
import { LogoTile } from "./logo";
import { SegmentedControl } from "./segmented-control";
import { SlidePreview, type SlidePreviewProps } from "./slide-preview";
import { Spinner } from "./spinner";

export type AutoCheckPreviewProps = {
  /** Describes what the preview shows, for screen readers. */
  alt: string;
  /** The challenge of the fallback path, a slide_puzzle as SlidePreview takes it; it stays still. */
  fallback: Omit<SlidePreviewProps, "alt" | "still" | "className">;
  /** The box alone, checking, without the loop or the switch: for a card. */
  still?: boolean;
  className?: string;
};

type Outcome = "pass" | "fallback";

/** How long the box checks before the outcome shows, and how long the outcome stays. */
const CHECK_MS = 1800;
const OUTCOME_MS = 3600;

/**
 * The auto_check box as the widget draws it, on a loop: the spinner and the checking text, then
 * the check mark and Verified. The switch shows the fallback path instead: after the check, a
 * challenge of the fallback type, here a still slide_puzzle, with the fallback text under it. Both
 * outcomes take the same room, so nothing around the preview moves while it loops.
 */
export function AutoCheckPreview({ alt, fallback, still = false, className }: AutoCheckPreviewProps) {
  const text = useUIText().autoCheckPreview;
  const [outcome, setOutcome] = useState<Outcome>("pass");
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (still) return;
    const timer = setTimeout(() => setChecked((value) => !value), checked ? OUTCOME_MS : CHECK_MS);
    return () => clearTimeout(timer);
  }, [checked, outcome, still]);

  const passed = !still && checked && outcome === "pass";
  const fellBack = !still && checked && outcome === "fallback";
  const box = (
    <div className="flex min-h-16 w-full max-w-80 items-center gap-2.5 rounded-lg border border-border bg-card px-3 py-2">
      {passed ? (
        <Check aria-hidden className="size-5 shrink-0 text-positive-text" />
      ) : (
        <Spinner className="size-5 text-primary motion-reduce:animate-none" />
      )}
      <span className={cn("min-w-0 flex-1 text-body text-foreground", passed && "font-medium text-positive-text")}>
        {passed ? text.verified : text.checking}
      </span>
      {/* The mark of the widget: the app tile of the logo over the name. */}
      <span className="grid shrink-0 justify-items-center gap-1 text-[10px] leading-none font-semibold text-muted-foreground">
        <LogoTile />
        WAU Captcha
      </span>
    </div>
  );

  if (still) {
    return (
      <div data-slot="auto-check-preview" role="img" aria-label={alt} className={cn("flex w-full justify-center", className)}>
        {box}
      </div>
    );
  }
  return (
    <div data-slot="auto-check-preview" className={cn("grid w-full max-w-[450px] justify-items-center gap-3", className)}>
      {/* Both outcomes in one cell: the fallback reserves its height even while the box shows. */}
      <div role="img" aria-label={alt} className="grid w-full place-items-center [&>*]:col-start-1 [&>*]:row-start-1">
        <div className={cn("grid w-full max-w-80 gap-2 rounded-lg border border-border bg-card p-3", !fellBack && "invisible")}>
          <SlidePreview {...fallback} alt="" still />
          <p className="text-overline text-muted-foreground">{text.fallback}</p>
        </div>
        {!fellBack && box}
      </div>
      <SegmentedControl
        aria-label={text.outcome}
        value={outcome}
        onValueChange={(next) => {
          setOutcome(next);
          setChecked(false);
        }}
        options={[
          { value: "pass", label: text.pass },
          { value: "fallback", label: text.fallBack },
        ]}
      />
    </div>
  );
}
