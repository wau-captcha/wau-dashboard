import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./spinner";

const base =
  "relative inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 whitespace-nowrap rounded-md border border-transparent " +
  "text-button font-medium outline-none select-none transition-colors " +
  "focus-visible:border-focus-border focus-visible:shadow-focus " +
  "disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 " +
  "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4";

const variants = {
  primary: "bg-primary text-primary-foreground hover:bg-primary-hover active:bg-primary/80",
  secondary: "bg-secondary text-secondary-foreground hover:bg-accent-border active:bg-secondary/80",
  outline: "border-input bg-background text-foreground hover:bg-muted hover:text-accent-foreground active:bg-muted/80",
  ghost: "text-muted-foreground hover:bg-accent-subtle hover:text-accent-foreground active:bg-accent-subtle/80",
  destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:bg-destructive/80",
  "destructive-outline":
    "border-input bg-background text-negative-text hover:border-negative/30 hover:bg-negative-bg active:bg-negative-bg/80",
  link: "h-auto border-0 px-0 text-foreground underline decoration-current/40 underline-offset-2 hover:text-accent-foreground hover:decoration-current",
} as const;

const sizes = {
  xs: "h-7 gap-1.5 px-2 text-overline [&_svg:not([class*='size-'])]:size-3.5",
  sm: "h-8 gap-1.5 px-3",
  md: "h-10 px-4",
  lg: "h-11 px-8",
  "icon-xs": "size-7 [&_svg:not([class*='size-'])]:size-3.5",
  "icon-sm": "size-8",
  icon: "size-10",
} as const;

export type ButtonVariant = keyof typeof variants;
export type ButtonSize = keyof typeof sizes;

/**
 * Button classes for elements that must not be a <button>, e.g. `<Link className={buttonVariants({ variant: "outline" })}>`.
 */
export function buttonVariants({
  variant = "primary",
  size = "md",
  className,
}: { variant?: ButtonVariant; size?: ButtonSize; className?: string } = {}) {
  return cn(base, sizes[size], variants[variant], className);
}

export type ButtonProps = ComponentProps<"button"> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Disables the button and replaces the start icon with a spinner. */
  loading?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
};

/** Defaults to `type="button"`; pass `type="submit"` inside forms. */
export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  startIcon,
  endIcon,
  disabled,
  type = "button",
  className,
  children,
  ...props
}: ButtonProps) {
  const iconOnly = size.startsWith("icon");

  return (
    <button
      type={type}
      data-slot="button"
      data-variant={variant}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={buttonVariants({ variant, size, className })}
      {...props}
    >
      {loading && iconOnly ? (
        <Spinner />
      ) : (
        <>
          {loading ? <Spinner /> : startIcon}
          {children}
          {endIcon}
        </>
      )}
    </button>
  );
}
