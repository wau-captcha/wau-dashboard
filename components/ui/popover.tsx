"use client";

import { Popover as BasePopover } from "@base-ui/react/popover";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { popupMotion } from "./control";

export const Popover = BasePopover.Root;
export const PopoverTrigger = BasePopover.Trigger;
export const PopoverClose = BasePopover.Close;

type PositionProps = Pick<
  BasePopover.Positioner.Props,
  "side" | "align" | "sideOffset" | "alignOffset" | "anchor" | "collisionPadding"
>;

export type PopoverContentProps = Omit<BasePopover.Popup.Props, "className"> &
  PositionProps & {
    className?: string;
  };

/** Floating panel anchored to its trigger (or to `anchor`). */
export function PopoverContent({
  side = "bottom",
  align = "center",
  sideOffset = 6,
  alignOffset,
  anchor,
  collisionPadding,
  className,
  ...props
}: PopoverContentProps) {
  return (
    <BasePopover.Portal>
      <BasePopover.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        anchor={anchor}
        collisionPadding={collisionPadding}
        className="z-popover outline-none"
      >
        <BasePopover.Popup
          data-slot="popover-content"
          className={cn(
            "w-72 rounded-lg border border-border bg-popover p-4 text-popover-foreground shadow-md outline-none",
            popupMotion,
            className,
          )}
          {...props}
        />
      </BasePopover.Positioner>
    </BasePopover.Portal>
  );
}

export function PopoverTitle({ className, ...props }: Omit<BasePopover.Title.Props, "className"> & { className?: string }) {
  return <BasePopover.Title className={cn("text-heading font-medium text-foreground", className)} {...props} />;
}

export function PopoverDescription({
  className,
  ...props
}: Omit<BasePopover.Description.Props, "className"> & { className?: string }) {
  return <BasePopover.Description className={cn("text-body text-muted-foreground", className)} {...props} />;
}

export function PopoverHeader({ className, ...props }: ComponentProps<"div">) {
  return <div className={cn("mb-3 grid gap-1", className)} {...props} />;
}
