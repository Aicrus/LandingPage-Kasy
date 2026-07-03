import { Inter, JetBrains_Mono, Nunito, Syne } from "next/font/google";
import localFont from "next/font/local";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const satoshi = localFont({
  src: [{ path: "../app/fonts/Satoshi-Bold.woff2", weight: "700", style: "normal" }],
  variable: "--font-display",
  display: "swap",
});

const nunito = Nunito({
  variable: "--font-rounded",
  subsets: ["latin", "latin-ext"],
  display: "swap",
});

const cursorGothic = localFont({
  src: [{ path: "../app/fonts/CursorGothic-Regular.woff2", weight: "400", style: "normal" }],
  variable: "--font-cursor-gothic",
  display: "swap",
  preload: false,
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const fontVariables = [
  inter.variable,
  satoshi.variable,
  nunito.variable,
  jetbrainsMono.variable,
  cursorGothic.variable,
  syne.variable,
].join(" ");
