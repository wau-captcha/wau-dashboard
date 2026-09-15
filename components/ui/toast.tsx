"use client";

import { Toast } from "@base-ui/react/toast";
import { CircleAlert, CircleCheck, Info, TriangleAlert, X } from "lucide-react";
import type { ReactNode } from "react";
import { Button } from "./button";
import { Spinner } from "./spinner";

export type ToastType = "default" | "success" | "error" | "warning" | "info" | "loading";

export type ToastOptions = {
  description?: ReactNode;
  /** Auto-dismiss delay in ms; 0 keeps the toast until dismissed. Default 5000 (loading: 0). */
  timeout?: number;
  /** Button inside the toast; clicking it runs `onClick` and closes the toast. */
  action?: { label: ReactNode; onClick: () => void };
  /** Reusing an id updates that toast in place (e.g. loading → success). */
  id?: string;
};

const manager = Toast.createToastManager();
let toastCount = 0;

function show(type: ToastType, title: ReactNode, options: ToastOptions = {}) {
  const id = options.id ?? `toast-${++toastCount}`;
  const { action } = options;
  return manager.add({
    id,
    type,
    title,
    description: options.description,
    // Explicit so a loading toast (timeout 0) updated by id starts auto-dismissing again.
    timeout: options.timeout ?? (type === "loading" ? 0 : 5000),
    priority: type === "error" ? "high" : "low",
    actionProps: action
      ? {
          children: action.label,
          onClick: () => {
            action.onClick();
            manager.close(id);
          },
        }
      : undefined,
  });
}

type PromiseMessages<T> = {
  loading: string;
  success: string | ((result: T) => string);
  error: string | ((error: unknown) => string);
};

/**
 * Transient notifications, callable from anywhere (event handlers, async code).
 * `toast.success("Đã lưu")`, `toast.error("Không thể xóa", { description })`, `toast.promise(save(), {...})`.
 * Requires <ToastProvider> (mounted in app Providers).
 */
export const toast = Object.assign((title: ReactNode, options?: ToastOptions) => show("default", title, options), {
  success: (title: ReactNode, options?: ToastOptions) => show("success", title, options),
  error: (title: ReactNode, options?: ToastOptions) => show("error", title, options),
  warning: (title: ReactNode, options?: ToastOptions) => show("warning", title, options),
  info: (title: ReactNode, options?: ToastOptions) => show("info", title, options),
  loading: (title: ReactNode, options?: ToastOptions) => show("loading", title, options),
  dismiss: (id?: string) => manager.close(id),
  promise: <T,>(promise: Promise<T>, messages: PromiseMessages<T>) =>
    manager.promise(promise, {
      loading: { title: messages.loading, type: "loading" },
      success: (result: T) => ({
        title: typeof messages.success === "function" ? messages.success(result) : messages.success,
        type: "success",
      }),
      error: (error: unknown) => ({
        title: typeof messages.error === "function" ? messages.error(error) : messages.error,
        type: "error",
      }),
    }),
});

function ToastIcon({ type }: { type?: string }) {
  switch (type) {
    case "success":
      return <CircleCheck aria-hidden className="mt-[3px] size-4 shrink-0 text-positive-text" />;
    case "error":
      return <CircleAlert aria-hidden className="mt-[3px] size-4 shrink-0 text-negative-text" />;
    case "warning":
      return <TriangleAlert aria-hidden className="mt-[3px] size-4 shrink-0 text-warning-text" />;
    case "info":
      return <Info aria-hidden className="mt-[3px] size-4 shrink-0 text-info-text" />;
    case "loading":
      return <Spinner className="mt-[3px] text-muted-foreground" />;
    default:
      return null;
  }
}

function ToastList() {
  const { toasts } = Toast.useToastManager();

  return toasts.map((item) => (
    <Toast.Root
      key={item.id}
      toast={item}
      data-slot="toast"
      className={
        "relative flex w-full items-start gap-3 rounded-lg border border-border bg-popover p-3.5 pr-10 text-popover-foreground shadow-lg " +
        "translate-x-(--toast-swipe-movement-x) transition-[opacity,translate] duration-200 ease-smooth-out " +
        "data-[starting-style]:translate-y-2 data-[starting-style]:opacity-0 data-[ending-style]:opacity-0 data-[limited]:hidden"
      }
    >
      <ToastIcon type={item.type} />
      <div className="grid min-w-0 flex-1 gap-0.5">
        <Toast.Title className="text-body font-medium text-foreground">{item.title}</Toast.Title>
        {item.description && (
          <Toast.Description className="text-body text-muted-foreground">{item.description}</Toast.Description>
        )}
        {item.actionProps && <Button variant="outline" size="xs" className="mt-2 w-fit" {...item.actionProps} />}
      </div>
      <Toast.Close
        aria-label="Đóng thông báo"
        className="absolute right-2.5 top-2.5 flex size-6 cursor-pointer items-center justify-center rounded-sm text-muted-foreground outline-none transition-colors hover:bg-muted hover:text-foreground focus-visible:shadow-focus"
      >
        <X className="size-3.5" />
      </Toast.Close>
    </Toast.Root>
  ));
}

/** Renders toasts in the bottom-right corner. Mount once near the root. */
export function ToastProvider({ children }: { children: ReactNode }) {
  return (
    <Toast.Provider toastManager={manager} limit={4}>
      {children}
      <Toast.Portal>
        <Toast.Viewport className="fixed bottom-4 right-4 z-toast flex w-[calc(100vw-2rem)] max-w-sm flex-col-reverse gap-2 outline-none">
          <ToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  );
}
