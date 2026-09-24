import type { ReactNode } from "react";
import { LanguageSwitcher } from "@/components/i18n/language-switcher";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { AppHeader } from "@/components/ui/app-header";
import { Badge } from "@/components/ui/badge";
import { Logo } from "@/components/ui/logo";
import { TableOfContents } from "@/components/ui/table-of-contents";
import { cn } from "@/lib/utils";

export type DemoNavItem = { id: string; label: string };

export function DemoShell({ nav, children }: { nav: DemoNavItem[]; children: ReactNode }) {
  return (
    <div className="min-h-full">
      <AppHeader
        brand={
          <Logo href="/demo">
            <Badge tone="primary" size="sm">
              UI Kit
            </Badge>
          </Logo>
        }
        settings={
          <>
            <LanguageSwitcher />
            <ThemeToggle />
          </>
        }
      />
      <div className="mx-auto grid max-w-7xl gap-x-10 px-4 sm:px-6 lg:grid-cols-[12rem_minmax(0,1fr)]">
        <TableOfContents
          items={nav.map((item) => ({ id: item.id, title: item.label }))}
          label="Thành phần"
          className="pt-6 lg:sticky lg:top-14 lg:h-[calc(100dvh-3.5rem)] lg:self-start lg:overflow-y-auto lg:py-8 lg:scrollbar-thin"
        />
        <main className="min-w-0 py-8">{children}</main>
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
