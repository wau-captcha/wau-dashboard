"use client";

import { useSyncExternalStore } from "react";

function subscribe(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

const isDark = () => document.documentElement.classList.contains("dark");

/** Whether dark mode is showing right now, whatever the stored preference is. */
export function useDarkMode(): boolean {
  return useSyncExternalStore(subscribe, isDark, () => false);
}
