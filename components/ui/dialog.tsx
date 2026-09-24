"use client";

import { AlertDialog as BaseAlertDialog } from "@base-ui/react/alert-dialog";
import { Dialog as BaseDialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { useState, type ComponentProps, type ReactElement, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";
import { useUIText } from "./locale";

export const Dialog = BaseDialog.Root;
export const DialogTrigger = BaseDialog.Trigger;
export const DialogClose = BaseDialog.Close;

/** The dimmed layer behind every modal panel. */
export const backdropClassName =
  "fixed inset-0 z-modal bg-black/50 transition-opacity duration-300 ease-drawer " +
  "data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 data-[ending-style]:duration-200";

const popupClassName =
  "fixed left-1/2 top-1/2 z-alert grid max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 overflow-y-auto " +
  "rounded-lg border border-border bg-popover p-6 text-popover-foreground shadow-lg outline-none " +
  "transition-[opacity,scale] duration-200 ease-smooth-out " +
  "data-[starting-style]:scale-[0.96] data-[starting-style]:opacity-0 " +
  "data-[ending-style]:scale-[0.96] data-[ending-style]:opacity-0 data-[ending-style]:duration-150";

const widths = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
} as const;

export type DialogContentProps = Omit<BaseDialog.Popup.Props, "className"> & {
  size?: keyof typeof widths;
  /** Renders the × button in the top-right corner. */
  showCloseButton?: boolean;
  className?: string;
};

export function DialogContent({ size = "md", showCloseButton = true, className, children, ...props }: DialogContentProps) {
  const text = useUIText().dialog;
  return (
    <BaseDialog.Portal>
      <BaseDialog.Backdrop className={backdropClassName} />
      <BaseDialog.Popup data-slot="dialog-content" className={cn(popupClassName, widths[size], className)} {...props}>
        {children}
        {showCloseButton && (
          <BaseDialog.Close render={<Button variant="ghost" size="icon-sm" className="absolute right-3 top-3" />}>
            <X />
            <span className="sr-only">{text.close}</span>
          </BaseDialog.Close>
        )}
      </BaseDialog.Popup>
    </BaseDialog.Portal>
  );
}

export function DialogHeader({ className, ...props }: ComponentProps<"div">) {
  return <div data-slot="dialog-header" className={cn("flex flex-col gap-1.5 pr-8", className)} {...props} />;
}

export function DialogTitle({ className, ...props }: Omit<BaseDialog.Title.Props, "className"> & { className?: string }) {
  return (
    <BaseDialog.Title
      data-slot="dialog-title"
      className={cn("text-title font-semibold text-foreground", className)}
      {...props}
    />
  );
}

export function DialogDescription({
  className,
  ...props
}: Omit<BaseDialog.Description.Props, "className"> & { className?: string }) {
  return (
    <BaseDialog.Description
      data-slot="dialog-description"
      className={cn("text-body text-muted-foreground", className)}
      {...props}
    />
  );
}

export function DialogFooter({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      data-slot="dialog-footer"
      className={cn("flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

export type ConfirmDialogProps = {
  /** Element that opens the dialog, e.g. <Button variant="destructive-outline">Delete</Button>. Omit when controlled. */
  trigger?: ReactElement;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  title: ReactNode;
  description?: ReactNode;
  /** Extra content between the description and the actions. */
  children?: ReactNode;
  confirmLabel?: ReactNode;
  cancelLabel?: ReactNode;
  tone?: "default" | "destructive";
  /**
   * Runs on confirm. The confirm button shows a spinner while the promise is pending and the dialog
   * closes when it resolves. If it throws, the dialog stays open; report the error from inside it.
   */
  onConfirm: () => void | Promise<void>;
};

/** Asks the user to confirm an action that is hard to undo. Cannot be dismissed by clicking outside. */
export function ConfirmDialog({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  children,
  confirmLabel,
  cancelLabel,
  tone = "default",
  onConfirm,
}: ConfirmDialogProps) {
  const text = useUIText().dialog;
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const [pending, setPending] = useState(false);
  const isOpen = open ?? uncontrolledOpen;

  function setOpen(next: boolean) {
    if (open === undefined) setUncontrolledOpen(next);
    onOpenChange?.(next);
  }

  async function confirm() {
    setPending(true);
    try {
      await onConfirm();
      setOpen(false);
    } finally {
      setPending(false);
    }
  }

  return (
    <BaseAlertDialog.Root
      open={isOpen}
      onOpenChange={(next) => {
        if (!pending) setOpen(next);
      }}
    >
      {trigger && <BaseAlertDialog.Trigger render={trigger} />}
      <BaseAlertDialog.Portal>
        <BaseAlertDialog.Backdrop className={backdropClassName} />
        <BaseAlertDialog.Popup data-slot="confirm-dialog" className={cn(popupClassName, "max-w-md")}>
          <div className="flex flex-col gap-1.5">
            <BaseAlertDialog.Title className="text-title font-semibold text-foreground">{title}</BaseAlertDialog.Title>
            {description && (
              <BaseAlertDialog.Description className="text-body text-muted-foreground">
                {description}
              </BaseAlertDialog.Description>
            )}
          </div>
          {children}
          <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
            <BaseAlertDialog.Close render={<Button variant="outline" disabled={pending} />}>{cancelLabel ?? text.cancel}</BaseAlertDialog.Close>
            <Button variant={tone === "destructive" ? "destructive" : "primary"} loading={pending} onClick={confirm}>
              {confirmLabel ?? text.confirm}
            </Button>
          </div>
        </BaseAlertDialog.Popup>
      </BaseAlertDialog.Portal>
    </BaseAlertDialog.Root>
  );
}
