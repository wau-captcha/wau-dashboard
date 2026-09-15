import { clsx, type ClassValue } from "clsx";
import { extendTailwindMerge } from "tailwind-merge";

// Teach tailwind-merge the custom tokens from globals.css; otherwise e.g. `text-body`
// is treated as a text color and silently dropped next to `text-muted-foreground`.
const twMerge = extendTailwindMerge({
  extend: {
    theme: {
      text: ["hero", "display", "title", "section", "heading", "prose", "body", "button", "overline"],
      font: ["brand"],
      shadow: ["focus", "error"],
      leading: ["body", "prose"],
      ease: ["smooth-out", "drawer", "bounce"],
    },
    classGroups: {
      z: [{ z: ["sticky", "overlay", "modal", "alert", "popover", "toast"] }],
    },
  },
});

/** Joins class names and resolves Tailwind conflicts; later classes win. */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
