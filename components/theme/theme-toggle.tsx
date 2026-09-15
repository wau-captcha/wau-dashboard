"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";
import { cn } from "@/lib/utils";

const THEME_CHANGE_EVENT = "wau-theme-change";
const darkQuery = "(prefers-color-scheme: dark)";

function readTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    return stored === "light" || stored === "dark" ? stored : "system";
  } catch {
    return "system";
  }
}

function applyTheme(theme: Theme) {
  const dark = theme === "dark" || (theme === "system" && window.matchMedia(darkQuery).matches);
  document.documentElement.classList.toggle("dark", dark);
}

function subscribe(onChange: () => void) {
  const handleStorage = (event: StorageEvent) => {
    if (event.key !== THEME_STORAGE_KEY) return;
    applyTheme(readTheme());
    onChange();
  };
  window.addEventListener("storage", handleStorage);
  window.addEventListener(THEME_CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", handleStorage);
    window.removeEventListener(THEME_CHANGE_EVENT, onChange);
  };
}

/** Current theme preference and a setter persisted to localStorage (synced across tabs). */
export function useTheme() {
  const theme = useSyncExternalStore(subscribe, readTheme, (): Theme => "system");

  // Follow OS changes while the preference is "system".
  useEffect(() => {
    if (theme !== "system") return;
    const media = window.matchMedia(darkQuery);
    const handleChange = () => applyTheme("system");
    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [theme]);

  function setTheme(next: Theme) {
    try {
      if (next === "system") localStorage.removeItem(THEME_STORAGE_KEY);
      else localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Storage is unavailable (private mode); the choice lasts for this page only.
    }
    applyTheme(next);
    window.dispatchEvent(new Event(THEME_CHANGE_EVENT));
  }

  return { theme, setTheme };
}

const options: { value: Theme; label: string; Icon: typeof Sun }[] = [
  { value: "light", label: "Giao diện sáng", Icon: Sun },
  { value: "dark", label: "Giao diện tối", Icon: Moon },
  { value: "system", label: "Theo hệ thống", Icon: Monitor },
];

/** Three-way light / dark / system switch. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();

  return (
    <div
      role="group"
      aria-label="Giao diện"
      className={cn("inline-flex items-center gap-0.5 rounded-md border border-border bg-muted p-0.5", className)}
    >
      {options.map(({ value, label, Icon }) => (
        <button
          key={value}
          type="button"
          aria-label={label}
          aria-pressed={theme === value}
          title={label}
          onClick={() => setTheme(value)}
          className={cn(
            "flex h-6 cursor-pointer items-center justify-center rounded-sm px-2 text-muted-foreground outline-none transition-colors",
            "hover:text-accent-foreground focus-visible:shadow-focus",
            theme === value && "bg-background text-accent-foreground shadow-sm",
          )}
        >
          <Icon className="size-3.5" />
        </button>
      ))}
    </div>
  );
}
