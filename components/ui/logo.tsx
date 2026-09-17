import { ShieldCheck } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type LogoProps = {
  /** Wraps the logo in a link, e.g. "/overview". */
  href?: string;
  /** Extra content after the wordmark, e.g. a Badge. */
  children?: ReactNode;
  className?: string;
};

/** Product mark: icon tile plus wordmark. */
export function Logo({ href, children, className }: LogoProps) {
  const mark = (
    <span className="flex items-center gap-2.5">
      <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
        <ShieldCheck className="size-4" />
      </span>
      <span className="font-brand text-heading font-semibold tracking-tight text-foreground">WAU Captcha</span>
    </span>
  );

  return (
    <div data-slot="logo" className={cn("flex items-center gap-2.5", className)}>
      {href ? (
        <Link href={href} className="rounded-md outline-none focus-visible:shadow-focus">
          {mark}
        </Link>
      ) : (
        mark
      )}
      {children}
    </div>
  );
}
