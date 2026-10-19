import Image from "next/image";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Figure } from "./figure";

export type DiagramProps = {
  /** The diagram drawn for the light theme and for the dark one, both width × height. */
  light: string;
  dark: string;
  width: number;
  height: number;
  /** Says what the diagram shows, for screen readers. */
  alt: string;
  caption?: ReactNode;
  /** Label of the link that opens the diagram at full size in a new tab. */
  openLabel: string;
  className?: string;
};

/**
 * A wide diagram in a frame, in the drawing of the site's theme. It fills the width it gets, but
 * never shrinks below 48rem: on a phone the frame scrolls sideways so the labels stay readable,
 * and the link under it opens the full size.
 */
export function Diagram({ light, dark, width, height, alt, caption, openLabel, className }: DiagramProps) {
  const image = "h-auto w-full min-w-192";
  const link = "text-link hover:text-link-hover";
  return (
    <Figure
      className={className}
      frameClassName="block bg-background p-0 sm:p-0"
      caption={
        <>
          {caption}
          {caption && " "}
          <a href={light} target="_blank" rel="noopener" className={cn(link, "dark:hidden")}>
            {openLabel}
          </a>
          <a href={dark} target="_blank" rel="noopener" className={cn(link, "hidden dark:inline")}>
            {openLabel}
          </a>
        </>
      }
    >
      <div className="scrollbar-thin overflow-x-auto">
        <Image src={light} alt={alt} width={width} height={height} unoptimized className={cn(image, "dark:hidden")} />
        <Image src={dark} alt={alt} width={width} height={height} unoptimized className={cn(image, "hidden dark:block")} />
      </div>
    </Figure>
  );
}
