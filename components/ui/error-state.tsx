import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export type ErrorStateProps = {
  /** The status code, shown large, e.g. "404". */
  code: string;
  title: ReactNode;
  description?: ReactNode;
  /** Buttons that lead on, e.g. a link back home. */
  actions?: ReactNode;
  /** Other places to go, a row of links under `linksLabel`. */
  links?: { href: string; label: string }[];
  /** Names the links, shown above them and to screen readers; pass the translated text. */
  linksLabel?: string;
  className?: string;
};

/**
 * A whole page that cannot be shown, such as a 404: the code, large, over the W of the logo in
 * the brand's colour, faint, as the brand's banners pattern their background with it; then what
 * happened and where to go instead.
 */
export function ErrorState({ code, title, description, actions, links, linksLabel, className }: ErrorStateProps) {
  return (
    <div data-slot="error-state" className={cn("grid w-full max-w-xl justify-items-center gap-6 text-center", className)}>
      <div className="relative isolate">
        <span aria-hidden className="pointer-events-none absolute top-1/2 left-1/2 -z-10 size-88 -translate-x-1/2 -translate-y-1/2 sm:size-120">
          <Image src="/brand/logo-symbol-purple.svg" alt="" width={96} height={96} className="size-full opacity-[0.07] dark:hidden" />
          <Image src="/brand/logo-symbol-lime.svg" alt="" width={96} height={96} className="hidden size-full opacity-[0.07] dark:block" />
        </span>
        <p className="font-brand text-[8rem] leading-none font-bold tracking-tighter text-foreground sm:text-[10rem]">{code}</p>
      </div>
      <div className="grid gap-2">
        <h1 className="font-brand text-hero font-semibold tracking-tight text-balance text-foreground">{title}</h1>
        {description && <p className="text-prose text-pretty text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap justify-center gap-2">{actions}</div>}
      {links && links.length > 0 && (
        <nav aria-label={linksLabel} className="grid gap-2 pt-2">
          {linksLabel && <p className="text-overline font-medium uppercase tracking-wide text-muted-foreground">{linksLabel}</p>}
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-1 text-body">
            {links.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="text-link hover:text-link-hover">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </div>
  );
}
