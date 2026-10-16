import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { uiText } from "@/components/ui/ui-text";
import { SITE_URL } from "@/lib/contact";
import { DEFAULT_LOCALE } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";

/**
 * The image social networks and chat apps show for a link to the site: the banner "Ảnh chia sẻ
 * link (Open Graph) 1200×630" of the brand file, laid out as it is there, with the site's own
 * words. It is made once, at build time, in the default language, which is what link previews
 * get: they send no language cookie.
 */
const t = getDictionary(DEFAULT_LOCALE);
const verified = uiText[DEFAULT_LOCALE].autoCheckPreview.verified;

export const alt = `${t.common.app.name}: ${t.site.landing.title}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The brand's colours, as the banner uses them.
const PAPER = "#fcfcfe";
const INK = "#03080a";
const INK_MUTED = "rgba(3, 8, 10, 0.69)";
const PURPLE = "#7624f4";
const POSITIVE = "#007544";

// Literal paths, so the build traces these files and no others.
const [medium, semiBold, bold, logo, symbol, tile, check] = await Promise.all([
  readFile(join(process.cwd(), "assets/og/PlusJakartaSans-Medium.ttf")),
  readFile(join(process.cwd(), "assets/og/PlusJakartaSans-SemiBold.ttf")),
  readFile(join(process.cwd(), "assets/og/PlusJakartaSans-Bold.ttf")),
  readFile(join(process.cwd(), "public/brand/logo-horizontal-light.svg")),
  readFile(join(process.cwd(), "public/brand/logo-symbol-paper.svg")),
  readFile(join(process.cwd(), "public/brand/logo-tile-purple.svg")),
  readFile(join(process.cwd(), "assets/og/verified-check.svg")),
]);
const svg = (file: Buffer) => `data:image/svg+xml;base64,${file.toString("base64")}`;

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ position: "relative", display: "flex", width: "100%", height: "100%", background: PAPER, fontFamily: "Plus Jakarta Sans" }}>
      {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse draws plain <img> only. */}
      <img src={svg(logo)} alt="" width={277.92} height={44} style={{ position: "absolute", left: 80, top: 76 }} />
      {/* A line per sentence, as the banner breaks it; a long sentence wraps in balanced lines. */}
      <div
        style={{
          position: "absolute",
          left: 80,
          top: 168,
          width: 560,
          display: "flex",
          flexDirection: "column",
          fontSize: 66,
          fontWeight: 700,
          lineHeight: "74px",
          letterSpacing: -2,
          color: INK,
        }}
      >
        {t.site.landing.title.split(/(?<=\.)\s+/).map((sentence) => (
          <div key={sentence} style={{ textWrap: "balance" }}>
            {sentence}
          </div>
        ))}
      </div>
      <div style={{ position: "absolute", left: 80, top: 410, width: 500, fontSize: 24, fontWeight: 500, lineHeight: "34px", color: INK_MUTED }}>
        {t.site.footer.tagline}
      </div>
      <div style={{ position: "absolute", left: 80, top: 520, fontSize: 24, fontWeight: 700, lineHeight: "30px", letterSpacing: -0.3, color: PURPLE }}>
        {new URL(SITE_URL).host}
      </div>
      <div style={{ position: "absolute", left: 680, top: 56, width: 464, height: 518, display: "flex", borderRadius: 32, background: PURPLE, overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse draws plain <img> only. */}
        <img src={svg(symbol)} alt="" width={260} height={260} style={{ position: "absolute", left: 102, top: 64 }} />
        {/* The captcha widget, verified, at 1.25 times its size. */}
        <div
          style={{
            position: "absolute",
            left: 32,
            top: 384,
            width: 400,
            height: 80,
            display: "flex",
            background: "#ffffff",
            border: "1.25px solid rgba(3, 8, 10, 0.08)",
            borderRadius: 10,
            boxShadow: "0 2.5px 5px rgba(3, 8, 10, 0.06)",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse draws plain <img> only. */}
          <img src={svg(check)} alt="" width={27.5} height={27.5} style={{ position: "absolute", left: 15, top: 25 }} />
          <div style={{ position: "absolute", left: 55, top: 27.5, fontSize: 17.5, fontWeight: 500, lineHeight: "22.5px", color: POSITIVE }}>
            {verified}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse draws plain <img> only. */}
          <img src={svg(tile)} alt="" width={22.5} height={22.5} style={{ position: "absolute", left: 323.75, top: 16.25 }} />
          <div
            style={{
              position: "absolute",
              left: 287.5,
              top: 43.75,
              width: 95,
              display: "flex",
              justifyContent: "center",
              fontSize: 12.5,
              fontWeight: 600,
              lineHeight: "12.5px",
              color: INK_MUTED,
            }}
          >
            {t.common.app.name}
          </div>
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Plus Jakarta Sans", data: medium, weight: 500, style: "normal" },
        { name: "Plus Jakarta Sans", data: semiBold, weight: 600, style: "normal" },
        { name: "Plus Jakarta Sans", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
