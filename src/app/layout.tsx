import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Nunito } from "next/font/google";
import localFont from "next/font/local";
import { MotionProvider } from "@/components/motion";
import { SiteHeader } from "@/components/site-header";
import { ThemeMetaSyncScript } from "@/components/theme-meta-sync";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/theme-toggle";
import { themeColorHeadInitScript } from "@/lib/theme-color";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

// Display sofisticado (Satoshi, self-hosted) — usado nos títulos.
const satoshi = localFont({
  src: [{ path: "./fonts/Satoshi-Bold.woff2", weight: "700", style: "normal" }],
  variable: "--font-display",
  display: "swap",
});

// Arredondada (rounded) — usada no subtítulo.
const nunito = Nunito({
  variable: "--font-rounded",
  subsets: ["latin"],
  display: "swap",
});

// Mono fica disponível p/ código/snippets no futuro; sem preload (nada usa hoje).
const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  title: "Landing Page",
  description: "Landing page em construção",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${satoshi.variable} ${nunito.variable} ${jetbrainsMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeColorHeadInitScript }} />
      </head>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <ThemeMetaSyncScript />
          <MotionProvider>
            <SiteHeader />
            <ThemeToggle />
            {children}
          </MotionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
