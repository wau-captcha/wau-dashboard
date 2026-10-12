import { ArrowLeft, Download } from "lucide-react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Alert } from "@/components/ui/alert";
import { AnimatedImage } from "@/components/ui/animated-image";
import { buttonVariants } from "@/components/ui/button";
import { Figure } from "@/components/ui/figure";
import { JumpPreview } from "@/components/ui/jump-preview";
import { RotatePreview } from "@/components/ui/rotate-preview";
import { SlidePreview } from "@/components/ui/slide-preview";
import { CAPTCHAS, SAMPLES_DIR, type CaptchaSample } from "@/lib/captchas";
import { challengeTypeLabel } from "@/lib/challenge-types";
import { getI18n } from "@/lib/i18n/server";
import manifest from "@/public/captchas/samples/manifest.json";
import { SubHeading } from "../../docs/_components/doc-section";

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return { title: t.captchas.samples.metaTitle, description: t.captchas.samples.metaDescription };
}

const samples = manifest as CaptchaSample[];

/**
 * Real challenges from cmd/samples of wau-services, with their answers, for benchmarking. The
 * manifest beside the files lists them all.
 */
export default async function SamplesPage() {
  const { t, format } = await getI18n();
  const text = t.captchas.samples;
  const file = (name: string) => `${SAMPLES_DIR}/${name}`;

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-12 px-4 py-10 sm:px-6 sm:py-14">
      <div className="grid gap-4">
        <Link href="/captchas" className={buttonVariants({ variant: "ghost", size: "sm", className: "justify-self-start" })}>
          <ArrowLeft /> {t.captchas.allCaptchas}
        </Link>
        <div className="grid max-w-3xl gap-3">
          <h1 className="font-brand text-hero font-semibold tracking-tight text-foreground">{text.title}</h1>
          <p className="text-prose text-muted-foreground">{text.description}</p>
        </div>
        <Alert tone="info">{text.live}</Alert>
        <a href={file("manifest.json")} download className={buttonVariants({ variant: "outline", className: "justify-self-start" })}>
          <Download /> {text.download}
        </a>
      </div>

      {/* auto_check has no media, so no samples. */}
      {CAPTCHAS.filter((captcha) => samples.some((sample) => sample.type === captcha.id)).map((captcha) => {
        const label = challengeTypeLabel(captcha.id, t.challengeTypes);
        const ofType = samples.filter((sample) => sample.type === captcha.id);
        return (
          <section key={captcha.id} className="grid gap-4">
            <SubHeading>
              {label} <code className="font-mono text-overline text-muted-foreground">{captcha.id}</code>
            </SubHeading>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {ofType.map((sample, index) => {
                const number = format.number(index + 1);
                const alt = text.alt(label, number);
                if (sample.type === "animal_jump" && sample.second_file && sample.poster) {
                  const targets = (sample.rounds ?? []).map((round, i) =>
                    text.round(format.number(i + 1), format.number(round.x0), format.number(round.x1), format.number(round.apex)),
                  );
                  return (
                    <Figure
                      key={sample.file}
                      caption={
                        <span className="grid">
                          {targets.map((target) => (
                            <span key={target}>{target}</span>
                          ))}
                        </span>
                      }
                    >
                      <JumpPreview
                        poster={file(sample.poster)}
                        rounds={[file(sample.file), file(sample.second_file)]}
                        width={sample.width}
                        height={sample.height}
                        alt={alt}
                        playingAlt={text.playing(label, number)}
                        playLabel={text.playRounds}
                        replayLabel={text.replay}
                        className="w-full [&_img]:w-full"
                      />
                    </Figure>
                  );
                }
                if (sample.type === "object_rotate" && sample.second_file && sample.frame_count) {
                  const targets = (sample.targets ?? []).map((target, i) =>
                    text.rotateRound(format.number(i + 1), format.number(target.frame), target.object),
                  );
                  return (
                    <Figure
                      key={sample.file}
                      caption={
                        <span className="grid">
                          {targets.map((target) => (
                            <span key={target}>{target}</span>
                          ))}
                        </span>
                      }
                    >
                      <RotatePreview
                        rounds={[file(sample.file), file(sample.second_file)]}
                        frames={sample.frame_count}
                        width={sample.width}
                        height={sample.height}
                        alt={alt}
                      />
                    </Figure>
                  );
                }
                if (sample.type === "slide_puzzle" && sample.piece_file) {
                  return (
                    <Figure key={sample.file} caption={text.target(format.number(sample.target_x ?? 0), format.number(sample.tolerance_px ?? 0))}>
                      <SlidePreview
                        background={file(sample.file)}
                        piece={file(sample.piece_file)}
                        width={sample.width}
                        height={sample.height}
                        pieceWidth={sample.piece_width ?? 0}
                        pieceHeight={sample.piece_height ?? 0}
                        targetX={sample.target_x ?? 0}
                        pieceY={sample.piece_y ?? 0}
                        alt={alt}
                      />
                    </Figure>
                  );
                }
                return (
                  <Figure key={sample.file} caption={<code className="font-mono">{text.answer(sample.answer)}</code>}>
                    {sample.poster ? (
                      <AnimatedImage
                        poster={file(sample.poster)}
                        src={file(sample.file)}
                        width={sample.width}
                        height={sample.height}
                        alt={alt}
                        playingAlt={text.playing(label, number)}
                        playLabel={text.play}
                        className="w-full [&_img]:w-full"
                      />
                    ) : (
                      <Image src={file(sample.file)} alt={alt} width={sample.width} height={sample.height} unoptimized className="h-auto w-full max-w-[300px] rounded-md" />
                    )}
                  </Figure>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
