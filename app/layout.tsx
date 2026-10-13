import type { Metadata } from "next";
import { Fira_Code, Geist_Mono, Plus_Jakarta_Sans, Victor_Mono } from "next/font/google";
import { InlineScript } from "@/components/inline-script";
import { Providers } from "@/components/providers";
import { getI18n } from "@/lib/i18n/server";
import { getNonce } from "@/lib/nonce";
import { themeInitScript } from "@/lib/theme";
import "./globals.css";

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin", "latin-ext", "vietnamese"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

/**
 * The fonts of CodeBlock only: Fira Code for code, Victor Mono's cursive italic for the italic
 * tokens. Both are 0.6em wide; a glyph they lack (Fira Code has no Vietnamese) comes from a system
 * monospace font rather than next/font's Arial-based fallback. Not preloaded: most pages show no
 * code, and the swap cannot move a line, as each is one fixed line-height tall. next/font only
 * takes literal options, hence the fallback list twice.
 */
const firaCode = Fira_Code({
  variable: "--font-code",
  weight: ["500"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "Liberation Mono", "monospace"],
  adjustFontFallback: false,
});

const victorMono = Victor_Mono({
  variable: "--font-code-italic",
  weight: ["700"],
  style: ["italic"],
  subsets: ["latin"],
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "Consolas", "Liberation Mono", "monospace"],
  adjustFontFallback: false,
});

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return {
    title: { default: t.common.app.name, template: `%s · ${t.common.app.name}` },
    description: t.common.app.description,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // The language comes from a cookie, so every route renders per request, as the nonce of the
  // Content-Security-Policy needs too.
  const [{ locale }, nonce] = await Promise.all([getI18n(), getNonce()]);

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${jakarta.variable} ${geistMono.variable} ${firaCode.variable} ${victorMono.variable} h-full antialiased`}
    >
      <head>
        {/* Sets the theme class before first paint, hence suppressHydrationWarning on <html>. */}
        <InlineScript html={themeInitScript} nonce={nonce} />
      </head>
      <body className="min-h-full flex flex-col">
        <Providers locale={locale}>
          {/* Isolated so portalled popups always stack above page content. */}
          <div className="isolate flex flex-1 flex-col">{children}</div>
        </Providers>
      </body>
    </html>
  );
}
