"use client";

/**
 * A script that runs while the browser parses the server HTML, before first paint. React never
 * runs scripts it renders on the client and warns about them, so the client render marks it
 * text/plain; suppressHydrationWarning accepts that difference, and the nonce the browser hides
 * once it has read it. Pass the page's nonce (getNonce), or the Content-Security-Policy blocks it.
 */
export function InlineScript({ html, nonce }: { html: string; nonce?: string | undefined }) {
  return (
    <script
      type={typeof window === "undefined" ? "text/javascript" : "text/plain"}
      nonce={nonce}
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
