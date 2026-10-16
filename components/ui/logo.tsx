import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** The name the logo spells out, for screen readers. */
const NAME = "WAU Captcha";

export type LogoProps = {
  /** Wraps the logo in a link, e.g. "/overview". */
  href?: string;
  /** Extra content after the logo, e.g. a Badge. */
  children?: ReactNode;
  className?: string;
};

/**
 * Product mark: the horizontal logo of the brand file, the W in purple with the name in ink on the
 * light theme, in lime with the name in paper on the dark one. 24 px tall, as in the dashboard
 * header of the brand guide, which allows no less than 20 px. The SVGs in public/brand are the
 * brand's own: never recolour, stretch or add effects to them.
 */
export function Logo({ href, children, className }: LogoProps) {
  const mark = (
    <span className="flex">
      <Image src="/brand/logo-horizontal-light.svg" alt={NAME} width={152} height={24} loading="eager" className="h-6 w-auto dark:hidden" />
      <Image src="/brand/logo-horizontal-dark.svg" alt={NAME} width={152} height={24} loading="eager" className="hidden h-6 w-auto dark:block" />
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

export type LogoTileProps = {
  /** The size, 18 px by default as in the captcha widget; the brand guide allows no less than 16 px. */
  className?: string;
};

/**
 * The app tile of the logo: the W on a purple tile on the light theme, on a lime one on the dark
 * theme. It stands for WAU Captcha where the name sits beside it, as in the captcha widget, so it
 * is hidden from screen readers.
 */
export function LogoTile({ className }: LogoTileProps) {
  return (
    <span data-slot="logo-tile" aria-hidden className={cn("relative block size-4.5 shrink-0", className)}>
      <Image src="/brand/logo-tile-purple.svg" alt="" width={18} height={18} loading="eager" className="size-full dark:hidden" />
      <Image src="/brand/logo-tile-lime.svg" alt="" width={18} height={18} loading="eager" className="hidden size-full dark:block" />
    </span>
  );
}
