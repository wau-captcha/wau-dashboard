"use client";

import { Tooltip as BaseTooltip } from "@base-ui/react/tooltip";
import type { ReactElement, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { popupMotion } from "./control";

/** Shares the open delay between tooltips; mounted once in app Providers. */
export const TooltipProvider = BaseTooltip.Provider;

export type TooltipProps = {
  content: ReactNode;
  /** The element that shows the tooltip. Must accept a ref and DOM props (e.g. Button). */
  children: ReactElement;
  side?: BaseTooltip.Positioner.Props["side"];
  align?: BaseTooltip.Positioner.Props["align"];
  sideOffset?: number;
  /** Hover delay in ms. */
  delay?: number;
  /** Keep false when clicking the trigger changes the tooltip text (e.g. "Đã sao chép"). */
  closeOnClick?: boolean;
  disabled?: boolean;
  className?: string;
};

/** Short hint on hover/focus. Never put essential information only in a tooltip. */
export function Tooltip({
  content,
  children,
  side = "top",
  align = "center",
  sideOffset = 6,
  delay = 400,
  closeOnClick = true,
  disabled,
  className,
}: TooltipProps) {
  return (
    <BaseTooltip.Root disabled={disabled}>
      <BaseTooltip.Trigger delay={delay} closeOnClick={closeOnClick} render={children} />
      <BaseTooltip.Portal>
        <BaseTooltip.Positioner side={side} align={align} sideOffset={sideOffset} className="z-popover">
          <BaseTooltip.Popup
            data-slot="tooltip"
            className={cn(
              "max-w-xs rounded-md border border-border bg-popover px-2.5 py-1.5 text-overline font-medium text-popover-foreground shadow-md",
              popupMotion,
              className,
            )}
          >
            {content}
          </BaseTooltip.Popup>
        </BaseTooltip.Positioner>
      </BaseTooltip.Portal>
    </BaseTooltip.Root>
  );
}
