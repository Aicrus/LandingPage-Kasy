import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Nunito, Syne } from "next/font/google";
import localFont from "next/font/local";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { MotionProvider } from "@/components/motion";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ThemeMetaSyncScript } from "@/components/theme-meta-sync";
import { ThemeProvider } from "@/components/theme-provider";
import { routing } from "@/i18n/routing";
import { themeColorHeadInitScript } from "@/lib/theme-color";
import "../globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Display sofisticado (Satoshi, self-hosted) — usado nos títulos.
const satoshi = localFont({
  src: [{ path: "../fonts/Satoshi-Bold.woff2", weight: "700", style: "normal" }],
  variable: "--font-display",
  display: "swap",
});

// Arredondada (rounded) — usada no subtítulo.
const nunito = Nunito({
  variable: "--font-rounded",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

// Cursor Gothic — wordmark do mock do editor (hero workspace).
const cursorGothic = localFont({
  src: [{ path: "../fonts/CursorGothic-Regular.woff2", weight: "400", style: "normal" }],
  variable: "--font-cursor-gothic",
  display: "swap",
  preload: false,
});

// Mono fica disponível p/ código/snippets no futuro; sem preload (nada usa hoje).
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

// Syne — texto grande de fundo da seção de vídeo ("Velocidade").
const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const fontVariables = [
  inter.variable,
  satoshi.variable,
  nunito.variable,
  jetbrainsMono.variable,
  cursorGothic.variable,
  syne.variable,
].join(" ");

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata" });

  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html
      lang={locale}
      className={`${fontVariables} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeColorHeadInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider>
            <ThemeMetaSyncScript />
            <MotionProvider>
              <SiteHeader />
              {children}
              <SiteFooter />
            </MotionProvider>
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
