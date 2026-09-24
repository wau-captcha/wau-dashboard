"use client";

import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { Menu, X } from "lucide-react";
import { useState, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { backdropClassName } from "./dialog";
import { useUIText } from "./locale";

const panelClassName =
  "fixed inset-y-0 right-0 z-alert flex w-[min(20rem,calc(100vw-3rem))] flex-col overflow-y-auto border-l border-border " +
  "bg-popover text-popover-foreground shadow-lg outline-none transition-transform duration-300 ease-drawer " +
  "data-[starting-style]:translate-x-full data-[ending-style]:translate-x-full data-[ending-style]:duration-200";

export type HeaderMenuProps = {
  nav?: ReactNode;
  /** Accessible name of the navigation inside the panel; pass the translated text. */
  navLabel: string;
  settings?: ReactNode;
  className?: string;
};

/** The menu of AppHeader on small screens: a panel from the right with the navigation and the settings. */
export function HeaderMenu({ nav, navLabel, settings, className }: HeaderMenuProps) {
  const text = useUIText();
  const [open, setOpen] = useState(false);

  // A link leads to another page, so the panel gets out of the way.
  function closeOnLink(event: MouseEvent<HTMLElement>) {
    if (event.target instanceof Element && event.target.closest("a")) setOpen(false);
  }

  return (
    <BaseDialog.Root open={open} onOpenChange={setOpen}>
      <BaseDialog.Trigger render={<Button variant="ghost" size="icon-sm" aria-label={text.appHeader.menu} className={className} />}>
        <Menu />
      </BaseDialog.Trigger>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop className={backdropClassName} />
        <BaseDialog.Popup data-slot="header-menu" className={panelClassName} onClick={closeOnLink}>
          <div className="flex h-14 shrink-0 items-center justify-between gap-2 border-b border-border px-4">
            <BaseDialog.Title className="text-heading font-medium text-foreground">{text.appHeader.menu}</BaseDialog.Title>
            <BaseDialog.Close render={<Button variant="ghost" size="icon-sm" aria-label={text.dialog.close} />}>
              <X />
            </BaseDialog.Close>
          </div>
          {nav && (
            <nav
              aria-label={navLabel}
              className={cn(
                "grid gap-1 p-3",
                "[&_[data-slot=nav-link]]:h-10 [&_[data-slot=nav-link]]:justify-start [&_[data-slot=nav-link]]:px-3",
              )}
            >
              {nav}
            </nav>
          )}
          {settings && <div className="flex flex-wrap items-center gap-2 border-t border-border p-4">{settings}</div>}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}
