/**
 * The captcha types WAU Captcha has, for the public captcha pages and the overview: their address,
 * their id in the API and the sample media under public/captchas. The samples are real output of
 * the renderers of wau-services, so the pages show exactly what visitors are asked to solve.
 */
export type CaptchaTypeId = "image_distort" | "motion_noise" | "slide_puzzle";

export type CaptchaInfo = {
  slug: "image-distort" | "motion-noise" | "slide-puzzle";
  id: CaptchaTypeId;
  /** The ChallengeType constant of the JavaScript SDKs. */
  constant: "IMAGE_DISTORT" | "MOTION_NOISE" | "SLIDE_PUZZLE";
  /** Size of the media in CSS pixels. */
  width: number;
  height: number;
};

export const CAPTCHAS: readonly CaptchaInfo[] = [
  { slug: "image-distort", id: "image_distort", constant: "IMAGE_DISTORT", width: 200, height: 70 },
  { slug: "motion-noise", id: "motion_noise", constant: "MOTION_NOISE", width: 300, height: 150 },
  { slug: "slide-puzzle", id: "slide_puzzle", constant: "SLIDE_PUZZLE", width: 300, height: 150 },
];

export function captchaBySlug(slug: string): CaptchaInfo | undefined {
  return CAPTCHAS.find((captcha) => captcha.slug === slug);
}

export const SAMPLES = {
  imageDistort: ["/captchas/image-distort-1.png", "/captchas/image-distort-2.png"],
  /** One frame of the animation: on its own, only noise. */
  motionNoiseFrame: "/captchas/motion-noise-frame.png",
  /** The 2-second loop; about 3 MB, so it only loads when asked for. */
  motionNoise: "/captchas/motion-noise.gif",
  slidePuzzle: {
    background: "/captchas/slide-puzzle.jpg",
    piece: "/captchas/slide-puzzle-piece.png",
    /** Where the piece sits in the sample: its hole starts at x, the piece always at y. */
    x: 174,
    y: 73,
    width: 73,
    height: 50,
  },
} as const;
