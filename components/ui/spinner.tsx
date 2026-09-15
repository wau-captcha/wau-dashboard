import { LoaderCircle, type LucideProps } from "lucide-react";
import { cn } from "@/lib/utils";

export type SpinnerProps = LucideProps & {
  /** Accessible text. Without it the spinner is decorative (e.g. inside a busy button). */
  label?: string;
};

export function Spinner({ label, className, ...props }: SpinnerProps) {
  return (
    <LoaderCircle
      data-slot="spinner"
      role={label ? "status" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
      className={cn("size-4 shrink-0 animate-spin", className)}
      {...props}
    />
  );
}
