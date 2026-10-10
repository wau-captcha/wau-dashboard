"use client";

import { Play, RotateCcw } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "./badge";
import { Button } from "./button";

export type JumpPreviewProps = {
  /** A still frame of the first round, shown until the viewer asks for the animation. */
  poster: string;
  /** The rounds, animated GIFs that play once, in order. Only downloaded once the viewer presses play. */
  rounds: readonly string[];
  width: number;
  height: number;
  /** Describes the still frame. */
  alt: string;
  /** Describes the rounds once they play. */
  playingAlt: string;
  /** Label of the play button, e.g. with the download size. */
  playLabel: string;
  replayLabel: string;
  /** How long one round plays. Default 2 000 ms. */
  roundMs?: number;
  className?: string;
};

/**
 * The rounds of an animal_jump challenge, played one after the other with a round counter, as the
 * widget plays them. Browsers share the animation of every image with the same URL, so each
 * playback gets an object URL of its own and starts from the first frame; a replay plays them all
 * again.
 */
export function JumpPreview({ poster, rounds, width, height, alt, playingAlt, playLabel, replayLabel, roundMs = 2000, className }: JumpPreviewProps) {
  // The round on screen, or null while the poster shows; played once every round has run.
  const [round, setRound] = useState<number | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [played, setPlayed] = useState(false);
  const [loading, setLoading] = useState(false);
  const blobs = useRef<Blob[] | null>(null);
  const objectUrl = useRef<string | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(
    () => () => {
      clearTimeout(timer.current);
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
    },
    [],
  );

  function show(index: number) {
    let next = `${rounds[index]}?play=${Date.now()}`;
    if (blobs.current) {
      if (objectUrl.current) URL.revokeObjectURL(objectUrl.current);
      next = objectUrl.current = URL.createObjectURL(blobs.current[index]);
    }
    setRound(index);
    setUrl(next);
  }

  async function play() {
    clearTimeout(timer.current);
    if (!blobs.current) {
      setLoading(true);
      try {
        blobs.current = await Promise.all(rounds.map(async (src) => (await fetch(src)).blob()));
      } catch {
        // Without the bytes, a URL of its own per playback restarts the GIF all the same.
        blobs.current = null;
      }
      setLoading(false);
    }
    setPlayed(false);
    show(0);
  }

  /** A round is timed from its load, when the browser starts the animation. */
  function loaded() {
    if (round === null) return;
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      if (round + 1 < rounds.length) {
        show(round + 1);
      } else {
        setRound(null);
        setPlayed(true);
      }
    }, roundMs);
  }

  const playing = round !== null;
  return (
    <div data-slot="jump-preview" className={cn("inline-grid max-w-full", className)}>
      <Image
        key={url ?? poster}
        src={url ?? poster}
        alt={url ? playingAlt : alt}
        width={width}
        height={height}
        unoptimized
        draggable={false}
        onLoad={loaded}
        className="col-start-1 row-start-1 h-auto max-w-full rounded-md"
      />
      {playing && (
        <Badge size="sm" className="col-start-1 row-start-1 m-2 self-start justify-self-start">
          {round + 1}/{rounds.length}
        </Badge>
      )}
      {!playing && (
        <Button
          size="sm"
          loading={loading}
          startIcon={played ? <RotateCcw /> : <Play />}
          className="col-start-1 row-start-1 place-self-center"
          onClick={() => void play()}
        >
          {played ? replayLabel : playLabel}
        </Button>
      )}
    </div>
  );
}
