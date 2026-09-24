"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export type TableOfContentsItem = {
  /** The id of the section on the page. */
  id: string;
  title: ReactNode;
};

export type TableOfContentsProps = {
  items: TableOfContentsItem[];
  /** Heading of the list and name of the navigation landmark; pass the translated text. */
  label: string;
  className?: string;
};

/**
 * Links to the sections of the page, highlighting the one being read as the page scrolls. From
 * `lg` up it is a list, to be made sticky beside the content; below it folds behind a button.
 */
export function TableOfContents({ items, label, className }: TableOfContentsProps) {
  const [open, setOpen] = useState(false);
  const { activeId, pin } = useActiveSection(items.map((item) => item.id));

  return (
    <nav data-slot="table-of-contents" aria-label={label} className={className}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-md border border-border bg-card px-3",
          "text-body font-medium text-foreground outline-none transition-colors hover:bg-card-hover",
          "focus-visible:border-focus-border focus-visible:shadow-focus lg:hidden",
        )}
      >
        {label}
        <ChevronDown className={cn("size-4 text-muted-foreground transition-transform", open && "rotate-180")} aria-hidden />
      </button>
      <p className="mb-3 hidden text-overline font-medium uppercase tracking-wide text-muted-foreground lg:block">{label}</p>
      <ul className={cn("mt-3 grid gap-1 border-l border-border lg:mt-0", !open && "max-lg:hidden")}>
        {items.map((item) => {
          const active = item.id === activeId;
          return (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                aria-current={active ? "location" : undefined}
                onClick={() => {
                  pin(item.id);
                  setOpen(false);
                }}
                className={cn(
                  "-ml-px block border-l border-transparent py-1 pl-3 text-body text-muted-foreground transition-colors",
                  "hover:border-foreground hover:text-foreground",
                  active && "border-primary text-accent-foreground hover:border-primary hover:text-accent-foreground",
                )}
              >
                {item.title}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

/** How far below its scroll margin the top of a section may be and still count as being read. */
const READING_TOLERANCE = 64;

/**
 * The section being read: the last one whose top has scrolled up to its scroll margin, give
 * or take READING_TOLERANCE, or the last one of all at the bottom of the page. A clicked link
 * stays highlighted until the reader scrolls, since the sections at the bottom may never get
 * that far up.
 */
function useActiveSection(ids: string[]) {
  const [activeId, setActiveId] = useState(ids[0]);
  const pinnedRef = useRef(false);
  const idList = ids.join(" ");

  useEffect(() => {
    const sections = idList
      .split(" ")
      .map((id) => document.getElementById(id))
      .filter((section) => section !== null);
    let frame = 0;

    function update() {
      frame = 0;
      if (pinnedRef.current || sections.length === 0) return;
      const root = document.documentElement;
      const atBottom = window.scrollY + window.innerHeight >= root.scrollHeight - 2;
      let current = sections[0];
      for (const section of sections) {
        const margin = parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
        if (section.getBoundingClientRect().top <= margin + READING_TOLERANCE) current = section;
      }
      setActiveId(atBottom ? sections[sections.length - 1].id : current.id);
    }
    const scheduleUpdate = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const unpin = () => {
      pinnedRef.current = false;
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    const intents = ["wheel", "touchstart", "keydown", "pointerdown"] as const;
    for (const intent of intents) window.addEventListener(intent, unpin, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      for (const intent of intents) window.removeEventListener(intent, unpin);
    };
  }, [idList]);

  function pin(id: string) {
    pinnedRef.current = true;
    setActiveId(id);
  }

  return { activeId, pin };
}
