"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useEffect, useSyncExternalStore } from "react";
import { useUIText } from "@/components/ui/locale";
import { SegmentedControl, type SegmentedOption } from "@/components/ui/segmented-control";
import { THEME_STORAGE_KEY, type Theme } from "@/lib/theme";

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

const icons: Record<Theme, typeof Sun> = { light: Sun, dark: Moon, system: Monitor };

/** Three-way light / dark / system switch. */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const text = useUIText().theme;
  const options: SegmentedOption<Theme>[] = (["light", "dark", "system"] as const).map((value) => {
    const Icon = icons[value];
    return { value, label: <Icon />, ariaLabel: text[value], title: text[value] };
  });

  return (
    <SegmentedControl aria-label={text.group} options={options} value={theme} onValueChange={setTheme} className={className} />
  );
}
