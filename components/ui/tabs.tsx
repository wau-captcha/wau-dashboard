"use client";

import { Tabs as BaseTabs } from "@base-ui/react/tabs";
import { createContext, use } from "react";
import { cn } from "@/lib/utils";

export type TabsVariant = "underline" | "segmented";

const TabsVariantContext = createContext<TabsVariant>("underline");

export type TabsProps = Omit<BaseTabs.Root.Props, "className"> & {
  /** `underline` for page sections, `segmented` for compact view switches. */
  variant?: TabsVariant;
  className?: string;
};

export function Tabs({ variant = "underline", className, ...props }: TabsProps) {
  return (
    <TabsVariantContext value={variant}>
      <BaseTabs.Root data-slot="tabs" className={cn("flex flex-col gap-4", className)} {...props} />
    </TabsVariantContext>
  );
}

export function TabsList({ className, ...props }: Omit<BaseTabs.List.Props, "className"> & { className?: string }) {
  const variant = use(TabsVariantContext);
  return (
    <BaseTabs.List
      data-slot="tabs-list"
      className={cn(
        variant === "underline"
          ? "flex items-center overflow-x-auto border-b border-border scrollbar-thin"
          : "inline-flex w-fit items-center gap-0.5 rounded-md border border-border bg-muted p-0.5",
        className,
      )}
      {...props}
    />
  );
}

export function TabsTab({ className, ...props }: Omit<BaseTabs.Tab.Props, "className"> & { className?: string }) {
  const variant = use(TabsVariantContext);
  return (
    <BaseTabs.Tab
      data-slot="tabs-tab"
      className={cn(
        "inline-flex shrink-0 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap text-body font-medium text-muted-foreground outline-none transition-colors",
        "focus-visible:shadow-focus data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&_svg:not([class*='size-'])]:size-4",
        variant === "underline"
          ? "-mb-px border-b-2 border-transparent px-4 py-2 hover:text-foreground data-[active]:border-primary data-[active]:text-primary"
          : "h-7 rounded-sm px-2.5 hover:text-accent-foreground data-[active]:bg-background data-[active]:text-accent-foreground data-[active]:shadow-sm",
        className,
      )}
      {...props}
    />
  );
}

export function TabsPanel({ className, ...props }: Omit<BaseTabs.Panel.Props, "className"> & { className?: string }) {
  return (
    <BaseTabs.Panel
      data-slot="tabs-panel"
      className={cn("rounded-md outline-none focus-visible:shadow-focus", className)}
      {...props}
    />
  );
}
