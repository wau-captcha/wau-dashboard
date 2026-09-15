"use client";

import { Menu } from "@base-ui/react/menu";
import { Check } from "lucide-react";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";
import { popupItem, popupMotion, popupSurface } from "./control";

export const DropdownMenu = Menu.Root;
export const DropdownMenuTrigger = Menu.Trigger;
export const DropdownMenuGroup = Menu.Group;

export type DropdownMenuContentProps = Omit<Menu.Popup.Props, "className"> &
  Pick<Menu.Positioner.Props, "side" | "align" | "sideOffset" | "alignOffset"> & {
    className?: string;
  };

export function DropdownMenuContent({
  side = "bottom",
  align = "end",
  sideOffset = 4,
  alignOffset,
  className,
  ...props
}: DropdownMenuContentProps) {
  return (
    <Menu.Portal>
      <Menu.Positioner
        side={side}
        align={align}
        sideOffset={sideOffset}
        alignOffset={alignOffset}
        className="z-popover outline-none"
      >
        <Menu.Popup
          data-slot="dropdown-menu-content"
          className={cn(
            popupSurface,
            popupMotion,
            "max-h-(--available-height) min-w-40 overflow-y-auto p-1 scrollbar-thin",
            className,
          )}
          {...props}
        />
      </Menu.Positioner>
    </Menu.Portal>
  );
}

export type DropdownMenuItemProps = Omit<Menu.Item.Props, "className"> & {
  variant?: "default" | "destructive";
  /** Indents the label to line up with checkbox items. */
  inset?: boolean;
  className?: string;
};

export function DropdownMenuItem({ variant = "default", inset, className, ...props }: DropdownMenuItemProps) {
  return (
    <Menu.Item
      data-slot="dropdown-menu-item"
      data-variant={variant}
      className={cn(
        popupItem,
        variant === "destructive" &&
          "text-negative-text data-[highlighted]:bg-negative-bg data-[highlighted]:text-negative-text [&_svg]:text-negative-text",
        inset && "pl-8",
        className,
      )}
      {...props}
    />
  );
}

export type DropdownMenuCheckboxItemProps = Omit<Menu.CheckboxItem.Props, "className"> & { className?: string };

export function DropdownMenuCheckboxItem({ className, children, ...props }: DropdownMenuCheckboxItemProps) {
  return (
    <Menu.CheckboxItem data-slot="dropdown-menu-checkbox-item" className={cn(popupItem, "pl-8", className)} {...props}>
      <Menu.CheckboxItemIndicator className="absolute left-2 flex items-center text-accent-foreground">
        <Check className="size-4" />
      </Menu.CheckboxItemIndicator>
      {children}
    </Menu.CheckboxItem>
  );
}

export function DropdownMenuLabel({
  inset,
  className,
  ...props
}: Omit<Menu.GroupLabel.Props, "className"> & { inset?: boolean; className?: string }) {
  return (
    <Menu.GroupLabel
      data-slot="dropdown-menu-label"
      className={cn("px-2 py-1.5 text-overline font-medium text-muted-foreground", inset && "pl-8", className)}
      {...props}
    />
  );
}

export function DropdownMenuSeparator({ className, ...props }: Omit<Menu.Separator.Props, "className"> & { className?: string }) {
  return <Menu.Separator data-slot="dropdown-menu-separator" className={cn("-mx-1 my-1 h-px bg-border", className)} {...props} />;
}

export function DropdownMenuShortcut({ className, ...props }: ComponentProps<"span">) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn("ml-auto pl-4 text-overline tracking-widest text-muted-foreground", className)}
      {...props}
    />
  );
}
