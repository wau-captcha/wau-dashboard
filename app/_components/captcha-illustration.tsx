import Image from "next/image";
import { AnimatedImage } from "@/components/ui/animated-image";
import { JumpPreview } from "@/components/ui/jump-preview";
import { SlidePreview } from "@/components/ui/slide-preview";
import { type CaptchaInfo, SAMPLES } from "@/lib/captchas";
import type { Dictionary } from "@/lib/i18n/dictionary";

type CaptchaIllustrationProps = {
  captcha: CaptchaInfo;
  text: Dictionary["captchaGuides"]["types"];
  /** A thumbnail for a card: one sample, and no animation. */
  compact?: boolean;
};

/** The real sample of a captcha type, shown a little larger than the widget shows it. */
export function CaptchaIllustration({ captcha, text, compact = false }: CaptchaIllustrationProps) {
  if (captcha.id === "image_distort") {
    const sample = text.image_distort;
    return (
      <>
        <Image src={SAMPLES.imageDistort[0]} alt={sample.alt} width={200} height={70} unoptimized className="h-auto w-full max-w-[300px] rounded-md" />
        {!compact && (
          <Image src={SAMPLES.imageDistort[1]} alt={sample.altSecond} width={200} height={70} unoptimized className="h-auto w-full max-w-[300px] rounded-md" />
        )}
      </>
    );
  }
  if (captcha.id === "motion_noise") {
    const sample = text.motion_noise;
    if (compact) {
      return <Image src={SAMPLES.motionNoiseFrame} alt={sample.alt} width={300} height={150} unoptimized className="h-auto w-full max-w-[450px] rounded-md" />;
    }
    return (
      <AnimatedImage
        poster={SAMPLES.motionNoiseFrame}
        src={SAMPLES.motionNoise}
        width={300}
        height={150}
        alt={sample.alt}
        playingAlt={sample.playing}
        playLabel={sample.play}
        className="w-full max-w-[450px] [&_img]:w-full"
      />
    );
  }
  if (captcha.id === "animal_jump") {
    const jump = SAMPLES.animalJump;
    const sample = text.animal_jump;
    if (compact) {
      return <Image src={jump.poster} alt={sample.alt} width={300} height={150} unoptimized className="h-auto w-full max-w-[450px] rounded-md" />;
    }
    return (
      <JumpPreview
        poster={jump.poster}
        rounds={jump.rounds}
        width={300}
        height={150}
        alt={sample.alt}
        playingAlt={sample.playing}
        playLabel={sample.play}
        replayLabel={sample.replay}
        className="w-full max-w-[450px] [&_img]:w-full"
      />
    );
  }
  const slide = SAMPLES.slidePuzzle;
  return (
    <SlidePreview
      background={slide.background}
      piece={slide.piece}
      width={300}
      height={150}
      pieceWidth={slide.width}
      pieceHeight={slide.height}
      targetX={slide.x}
      pieceY={slide.y}
      alt={text.slide_puzzle.alt}
    />
  );
}
