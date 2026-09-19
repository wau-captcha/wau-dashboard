import type { Metadata } from "next";
import { Geist_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { InlineScript } from "@/components/inline-script";
import { Providers } from "@/components/providers";
import { getI18n } from "@/lib/i18n/server";
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

export async function generateMetadata(): Promise<Metadata> {
  const { t } = await getI18n();
  return {
    title: { default: t.common.app.name, template: `%s · ${t.common.app.name}` },
    description: t.common.app.description,
  };
}

export default async function RootLayout({ children }: LayoutProps<"/">) {
  // The language comes from a cookie, so every route renders per request.
  const { locale } = await getI18n();

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${jakarta.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        {/* Sets the theme class before first paint, hence suppressHydrationWarning on <html>. */}
        <InlineScript html={themeInitScript} />
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
