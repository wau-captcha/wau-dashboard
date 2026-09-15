import { ShieldCheck } from "lucide-react";
import type { ReactNode } from "react";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export type DemoNavItem = { id: string; label: string };

export function DemoShell({ nav, children }: { nav: DemoNavItem[]; children: ReactNode }) {
  return (
    <div className="min-h-full">
      <header className="sticky top-0 z-sticky border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
          <div className="flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <ShieldCheck className="size-4" />
            </span>
            <span className="font-brand text-heading font-semibold tracking-tight text-foreground">WAU Captcha</span>
            <Badge tone="primary" size="sm">
              UI Kit
            </Badge>
          </div>
          <ThemeToggle />
        </div>
      </header>
      <div className="mx-auto flex max-w-7xl gap-10 px-4 sm:px-6">
        <nav
          aria-label="Mục lục"
          className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-48 shrink-0 overflow-y-auto py-8 scrollbar-thin lg:block"
        >
          <p className="mb-2 px-2 text-overline font-medium text-muted-foreground">Thành phần</p>
          <ul className="grid gap-0.5">
            {nav.map((item) => (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  className="block rounded-md px-2 py-1.5 text-body text-muted-foreground transition-colors hover:bg-card-hover hover:text-accent-foreground"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <main className="min-w-0 flex-1 py-8">{children}</main>
      </div>
    </div>
  );
}

export function DemoSection({
  id,
  title,
  description,
  children,
}: {
  id: string;
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-16 border-t border-border py-10">
      <div className="mb-6 grid gap-1">
        <h2 className="font-brand text-display font-semibold tracking-tight text-foreground">{title}</h2>
        {description && <p className="max-w-3xl text-body text-muted-foreground">{description}</p>}
      </div>
      <div className="grid gap-8">{children}</div>
    </section>
  );
}

export function DemoBlock({
  title,
  description,
  children,
  className,
  contentClassName,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}) {
  return (
    // auto_1fr keeps titles aligned and cards equally tall when blocks sit side by side.
    <div className={cn("grid grid-rows-[auto_1fr] gap-3", className)}>
      <div className="grid gap-0.5">
        <h3 className="text-heading font-medium text-foreground">{title}</h3>
        {description && <p className="text-body text-muted-foreground">{description}</p>}
      </div>
      <div className={cn("min-w-0 rounded-lg border border-border bg-card p-5", contentClassName)}>{children}</div>
    </div>
  );
}

/** Small caption above an example inside a block. */
export function DemoLabel({ children }: { children: ReactNode }) {
  return <p className="mb-2 text-overline font-medium text-muted-foreground">{children}</p>;
}
