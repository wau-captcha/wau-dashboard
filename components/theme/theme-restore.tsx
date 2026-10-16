"use client";

import { useLayoutEffect } from "react";
import { applyTheme, readTheme } from "./theme-toggle";

/**
 * Applies the stored theme where the theme script of the root layout did not run: a 404 is sent
 * as an empty error shell that the browser builds from the payload alone, so the head script
 * arrives as text. A layout effect runs before that first paint.
 */
export function ThemeRestore() {
  useLayoutEffect(() => applyTheme(readTheme()), []);
  return null;
}
