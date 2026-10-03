"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export type TabNavProps = Omit<ComponentProps<"nav">, "aria-label"> & {
  /** Names the navigation for assistive technology. */
  "aria-label": string;
};

/**
 * Links between the pages of one section, drawn like underline Tabs. Tabs switch panels in a
 * page; these change the address, so each page can be opened, bookmarked and shared.
 */
export function TabNav({ className, ...props }: TabNavProps) {
  return (
    <nav
      data-slot="tab-nav"
      className={cn("flex items-center overflow-x-auto border-b border-border scrollbar-thin", className)}
      {...props}
    />
  );
}

export type TabNavLinkProps = ComponentProps<typeof Link> & {
  href: string;
  /** Match the path exactly instead of also matching sub-paths. */
  exact?: boolean;
};

/** One page of a TabNav; marks itself as the current page. */
export function TabNavLink({ href, exact, className, ...props }: TabNavLinkProps) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      data-slot="tab-nav-link"
      aria-current={active ? "page" : undefined}
      className={cn(
        "-mb-px inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap border-b-2 border-transparent px-4 py-2",
        "text-body font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:shadow-focus",
        "aria-[current=page]:border-primary aria-[current=page]:text-primary [&_svg:not([class*='size-'])]:size-4",
        className,
      )}
      href={href}
      {...props}
    />
  );
}
