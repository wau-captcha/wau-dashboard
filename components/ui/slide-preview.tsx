import Image from "next/image";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

export type SlidePreviewProps = {
  background: string;
  piece: string;
  /** Size of the background, and the piece's size and target, all in pixels of the background. */
  width: number;
  height: number;
  pieceWidth: number;
  pieceHeight: number;
  /** Left edge of the hole the piece slides into. */
  targetX: number;
  /** Top edge of the piece, which slides along its row. */
  pieceY: number;
  alt: string;
  /** The piece at the start, as a challenge is shown, without moving: e.g. auto_check's fallback. */
  still?: boolean;
  className?: string;
};

const percent = (part: number, whole: number) => `${(part / whole) * 100}%`;

/**
 * A slide puzzle that solves itself: the piece slides along its row into the hole and back, on a
 * loop. With reduced motion, or `still`, it stays at the start. Everything scales with the width.
 */
export function SlidePreview({ background, piece, width, height, pieceWidth, pieceHeight, targetX, pieceY, alt, still = false, className }: SlidePreviewProps) {
  return (
    <div
      data-slot="slide-preview"
      role="img"
      aria-label={alt}
      className={cn("relative w-full max-w-[var(--slide-width)] overflow-hidden rounded-md", className)}
      style={{ "--slide-width": `${width * 1.5}px`, "--slide-to": percent(targetX, width) } as CSSProperties}
    >
      <Image src={background} alt="" width={width} height={height} unoptimized className="block h-auto w-full" />
      <Image
        src={piece}
        alt=""
        width={pieceWidth}
        height={pieceHeight}
        unoptimized
        className={cn("absolute left-0 h-auto", !still && "animate-slide-preview motion-reduce:animate-none")}
        style={{ top: percent(pieceY, height), width: percent(pieceWidth, width) }}
      />
    </div>
  );
}
