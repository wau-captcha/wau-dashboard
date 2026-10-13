import type { CSSProperties } from "react";
import { highlightCode, type CodeToken } from "@/lib/highlight";
import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";

export type CodeBlockProps = {
  code: string;
  /**
   * Short label in the title bar, shown as given, e.g. "bash" or "app/signup/page.tsx". It also picks
   * the syntax colours, by language name or file extension (lib/highlight.ts); anything else, or no
   * label, is plain text.
   */
  language?: string;
  copyable?: boolean;
  className?: string;
};

/** A token with a colour or an italic is a span carrying both themes' colours; a plain one is text. */
function renderToken(token: CodeToken, index: number) {
  const italic = [token.lightItalic && "light", token.darkItalic && "dark"].filter(Boolean).join(" ");
  if (!token.light && !token.dark && !italic) return token.content;
  const style: Record<string, string> = {};
  if (token.light) style["--shiki-light"] = token.light;
  if (token.dark) style["--shiki-dark"] = token.dark;
  return (
    <span key={index} style={style as CSSProperties} data-italic={italic || undefined}>
      {token.content}
    </span>
  );
}

/**
 * Read-only snippet in an editor window: window dots, line numbers, syntax colours and a copy
 * button. Long lines scroll sideways while the numbers stay. The window has a palette of its own,
 * Material Lighter or Material Oceanic with the site's theme (.code-window in app/globals.css).
 */
export function CodeBlock({ code, language, copyable = true, className }: CodeBlockProps) {
  const lines = highlightCode(code, language);

  return (
    <div data-slot="code-block" className={cn("code-window min-w-0", className)}>
      <div className="code-window-bar">
        <span aria-hidden="true" className="code-window-dots">
          <span />
          <span />
          <span />
        </span>
        {language && <span className="code-window-label">{language}</span>}
        {copyable && (
          <CopyButton
            value={code}
            size="icon-xs"
            // Taller than the 12px row, which it overflows rather than grows.
            className="-my-2 -mr-[7px] ml-auto border-0 bg-transparent text-(color:--code-window-chrome) hover:bg-transparent hover:text-(color:--code-window-chrome-hover) focus-visible:text-(color:--code-window-chrome-hover) active:bg-transparent"
          />
        )}
      </div>
      <pre className="code-window-body scrollbar-thin">
        <span className="code-window-rows">
          <span aria-hidden="true" className="code-window-numbers">
            {lines.map((_, index) => (
              <span key={index}>{index + 1}</span>
            ))}
          </span>
          <code translate="no" className="code-window-code">
            {lines.map((line, index) => (
              <span key={index} className="code-window-line">
                {line.map(renderToken)}
              </span>
            ))}
          </code>
        </span>
      </pre>
    </div>
  );
}
