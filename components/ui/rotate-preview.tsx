"use client";

import { RotateCcw, RotateCw } from "lucide-react";
import { type KeyboardEvent, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";
import { useUIText } from "./locale";
import { SegmentedControl } from "./segmented-control";

export type RotatePreviewProps = {
  /**
   * The strip of each round, in order: `frames` frames of width × height side by side, frame k the
   * object turned k steps clockwise as seen from above.
   */
  rounds: readonly string[];
  frames: number;
  /** Size of one frame. */
  width: number;
  height: number;
  /** Describes the challenge; the frame on screen is added for screen readers. */
  alt: string;
  /** Frame 0 of round 1 alone, without buttons: for a card. */
  still?: boolean;
  rotateLeftLabel?: string;
  rotateRightLabel?: string;
  className?: string;
};

/**
 * An object_rotate challenge to try: a round's frame, the object turned a frame at a time with
 * Rotate left and Rotate right (or the arrow keys on the image), and a switch between the rounds.
 * As in the widget, the strip is the background of the image, sized to its frames across, and each
 * round starts at frame 0.
 */
export function RotatePreview({ rounds, frames, width, height, alt, still = false, rotateLeftLabel, rotateRightLabel, className }: RotatePreviewProps) {
  const text = useUIText().rotatePreview;
  const [round, setRound] = useState(0);
  const [frame, setFrame] = useState(0);
  const turn = (direction: 1 | -1) => setFrame((current) => (current + direction + frames) % frames);
  const left = rotateLeftLabel ?? text.rotateLeft;
  const right = rotateRightLabel ?? text.rotateRight;

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const direction = { ArrowLeft: -1, ArrowRight: 1 }[event.key] as 1 | -1 | undefined;
    if (!direction) return;
    // The arrows would scroll the page otherwise.
    event.preventDefault();
    turn(direction);
  }

  const image = (
    <div
      role="img"
      aria-label={still ? alt : `${alt}. ${text.frame(frame)}`}
      tabIndex={still ? undefined : 0}
      onKeyDown={still ? undefined : onKeyDown}
      className="relative w-full rounded-md bg-muted bg-no-repeat outline-none focus-visible:shadow-focus"
      style={{
        aspectRatio: `${width} / ${height}`,
        backgroundImage: `url("${rounds[round]}")`,
        backgroundSize: `${frames * 100}% 100%`,
        backgroundPosition: `${frames > 1 ? (frame / (frames - 1)) * 100 : 0}% 0`,
      }}
    >
      {/* Dark like the widget's round counter: the frames are drawn on light backgrounds in either theme. */}
      {!still && rounds.length > 1 && (
        <Badge size="sm" className="absolute top-2 left-2 border-transparent bg-black/55 text-white">
          {round + 1}/{rounds.length}
        </Badge>
      )}
    </div>
  );
  if (still) {
    return (
      <div data-slot="rotate-preview" className={cn("grid w-full", className)}>
        {image}
      </div>
    );
  }
  return (
    <div data-slot="rotate-preview" className={cn("grid w-full gap-2", className)}>
      {image}
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="icon-sm" aria-label={left} title={left} onClick={() => turn(-1)}>
          <RotateCcw />
        </Button>
        <Button variant="outline" size="icon-sm" aria-label={right} title={right} onClick={() => turn(1)}>
          <RotateCw />
        </Button>
        <span aria-live="polite" className="text-overline text-muted-foreground tabular-nums">
          {text.frame(frame)}
        </span>
        {rounds.length > 1 && (
          <SegmentedControl
            aria-label={text.rounds}
            value={String(round)}
            onValueChange={(value) => {
              setRound(Number(value));
              setFrame(0);
            }}
            options={rounds.map((_, index) => ({ value: String(index), label: text.round(index + 1) }))}
            className="ml-auto"
          />
        )}
      </div>
    </div>
  );
}
