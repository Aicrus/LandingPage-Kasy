/**
 * Tipografia oficial do projeto.
 *
 * Sans: Inter — títulos, UI e corpo
 * Mono: JetBrains Mono — subtítulos técnicos, stats e código
 *
 * Carregamento: `src/app/layout.tsx` (next/font)
 * Tokens e utilitários: `src/app/globals.css`
 */
export const type = {
  /** Hero e títulos de seção — Inter (~520), tracking apertado */
  display: "type-display",
  /** Subtítulos e stats — JetBrains Mono, escala menor */
  subtitle: "type-subtitle",
  /** Corpo de texto — Inter, escala fluida */
  body: "type-body",
  /** Feature cards — Satoshi, mesma família do hero (App no ar) */
  featureTitle: "type-feature-title",
  /** Feature cards — Nunito, mesma família do lead do hero */
  featureDesc: "type-feature-desc",
  /** Feature cards — índice 01/02/03 */
  featureNum: "type-feature-num",
} as const;

export const typeMaxWidth = {
  title: "max-w-fluid-title",
  subtitle: "max-w-fluid-subtitle",
  body: "max-w-fluid-body",
} as const;
