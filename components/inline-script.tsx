"use client";

/**
 * A script that runs while the browser parses the server HTML, before first paint. React never
 * runs scripts it renders on the client and warns about them, so the client render marks it
 * text/plain; suppressHydrationWarning accepts that difference.
 */
export function InlineScript({ html }: { html: string }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
