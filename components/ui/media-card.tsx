import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent } from "./card";

export type MediaCardProps = {
  href: string;
  title: ReactNode;
  description: ReactNode;
  /** An illustration above the text, shown in a muted frame of a fixed shape. */
  media?: ReactNode;
  /** Beside the title, e.g. a code or a Badge. */
  meta?: ReactNode;
  /** The words of the link at the bottom, e.g. "Learn more". */
  action: ReactNode;
  className?: string;
};

/** A card that links somewhere as a whole: an illustration, a title, one or two sentences. */
export function MediaCard({ href, title, description, media, meta, action, className }: MediaCardProps) {
  return (
    <Link
      href={href}
      data-slot="media-card"
      className={cn("group block h-full rounded-lg outline-none focus-visible:shadow-focus", className)}
    >
      <Card interactive className="h-full">
        {media && (
          <div className="flex aspect-[2/1] items-center justify-center overflow-hidden border-b border-border bg-muted p-3">{media}</div>
        )}
        <CardContent className="grid flex-1 content-start gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-heading font-medium text-foreground">{title}</h3>
            {meta}
          </div>
          <p className="text-body text-muted-foreground">{description}</p>
          <span className="mt-auto inline-flex items-center gap-1 text-body font-medium text-link group-hover:text-link-hover">
            {action} <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </CardContent>
      </Card>
    </Link>
  );
}
