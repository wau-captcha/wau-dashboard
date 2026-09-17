import { cn } from "@/lib/utils";
import { CopyButton } from "./copy-button";

export type CodeBlockProps = {
  code: string;
  /** Short label in the top bar, e.g. "bash" or "javascript". */
  language?: string;
  copyable?: boolean;
  className?: string;
};

/** Read-only snippet with horizontal scrolling and a copy button. */
export function CodeBlock({ code, language, copyable = true, className }: CodeBlockProps) {
  return (
    <div
      data-slot="code-block"
      className={cn("min-w-0 overflow-hidden rounded-lg border border-border bg-muted", className)}
    >
      {(language || copyable) && (
        // A bar rather than an overlay: long lines scroll under an overlay and become unreadable.
        <div className="flex h-8 items-center justify-between gap-2 border-b border-border px-3">
          <span className="text-overline text-muted-foreground">{language}</span>
          {copyable && <CopyButton value={code} size="icon-xs" className="-mr-1.5" />}
        </div>
      )}
      <pre className="overflow-x-auto px-4 py-3 text-overline leading-5 scrollbar-thin">
        <code translate="no" className="font-mono text-foreground">
          {code}
        </code>
      </pre>
    </div>
  );
}
