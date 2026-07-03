/**
 * Typography class tokens for the landing page.
 *
 * Font loading: `src/lib/fonts.ts` (next/font)
 * CSS variables + utilities: `src/app/globals.css`
 * Applied on `<html>` via `fontVariables` in `src/app/[locale]/layout.tsx`
 *
 * Hierarchy:
 * - Inter (`font-sans`) — UI, body, nav, buttons, FAQ questions
 * - Satoshi Bold (`font-heading` / `--font-display`) — titles, logo, prices, marquee
 * - Nunito (`font-rounded`) — subtitles and soft secondary copy
 * - JetBrains Mono (`font-mono`) — code, technical badges
 * - Syne (`font-syne`) — large decorative text in VideoShowcase only
 * - Cursor Gothic (`--font-cursor-gothic`) — loaded, reserved for IDE mock wordmark
 */
export const type = {
  /** Section and hero titles — Satoshi Bold */
  display: "type-display",
  /** Lead lines and stats — Nunito */
  subtitle: "type-subtitle",
  /** Body copy — Inter */
  body: "type-body",
  /** Feature card titles — Satoshi */
  featureTitle: "type-feature-title",
  /** Feature card descriptions — Nunito */
  featureDesc: "type-feature-desc",
  /** Feature card index (01, 02, …) — Nunito */
  featureNum: "type-feature-num",
} as const;

export const typeMaxWidth = {
  title: "max-w-fluid-title",
  subtitle: "max-w-fluid-subtitle",
  body: "max-w-fluid-body",
} as const;

/** Tailwind font-family utilities mapped to loaded faces. */
export const fontFamily = {
  sans: "font-sans",
  heading: "font-heading",
  rounded: "font-rounded",
  mono: "font-mono",
  syne: "font-[family-name:var(--font-syne)]",
} as const;
