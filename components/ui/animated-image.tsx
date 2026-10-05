"use client";

import { Play } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "./button";

export type AnimatedImageProps = {
  /** A still frame, shown until the viewer asks for the animation. */
  poster: string;
  /** The animation, e.g. a GIF; only downloaded once the viewer presses play. */
  src: string;
  width: number;
  height: number;
  /** Describes the still frame. */
  alt: string;
  /** Describes the animation once it plays. */
  playingAlt: string;
  /** Label of the play button, e.g. with the download size. */
  playLabel: string;
  className?: string;
};

/** A still frame with a play button over it, so a heavy animation only loads when someone wants it. */
export function AnimatedImage({ poster, src, width, height, alt, playingAlt, playLabel, className }: AnimatedImageProps) {
  const [playing, setPlaying] = useState(false);

  return (
    <div data-slot="animated-image" className={cn("inline-grid max-w-full", className)}>
      <Image
        src={playing ? src : poster}
        alt={playing ? playingAlt : alt}
        width={width}
        height={height}
        unoptimized
        className="col-start-1 row-start-1 h-auto max-w-full rounded-md"
      />
      {!playing && (
        <Button size="sm" startIcon={<Play />} className="col-start-1 row-start-1 place-self-center" onClick={() => setPlaying(true)}>
          {playLabel}
        </Button>
      )}
    </div>
  );
}
