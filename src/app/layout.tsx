import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
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

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
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
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
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
