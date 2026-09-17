"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentProps } from "react";
import { buttonVariants } from "./button";
import { cn } from "@/lib/utils";

export type NavLinkProps = ComponentProps<typeof Link> & {
  href: string;
  /** Match the path exactly instead of also matching sub-paths. */
  exact?: boolean;
};

/** Navigation link that marks itself as the current page. */
export function NavLink({ href, exact, className, ...props }: NavLinkProps) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      data-slot="nav-link"
      aria-current={active ? "page" : undefined}
      className={cn(
        buttonVariants({ variant: "ghost", size: "sm" }),
        active && "bg-accent-subtle text-accent-foreground",
        className,
      )}
      href={href}
      {...props}
    />
  );
}
