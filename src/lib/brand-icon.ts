/** Landing palette — keep in sync with `src/app/globals.css` (Flutter Blue #0553B1) */
export const LANDING_BACKGROUND_LIGHT = "#f2f6fc";
export const LANDING_PRIMARY_LIGHT = "#0553b1";
export const LANDING_BACKGROUND_DARK = "#0a1220";
export const LANDING_PRIMARY_DARK = "#4ba3ff";

/** Docs tab accents (favicon glow per section, dark UI) — mesma ordem do docs.css no Kit. */
export const SECTION_FAVICON_COLORS: Record<string, string> = {
  comece: LANDING_PRIMARY_DARK,
  conceitos: "#38bdf8",
  funcionalidades: "#1cdac5",
  gerenciar: "#fb923c",
  personalizacao: "#a78bfa",
  publicar: "#f472b6",
  referencia: "#94a3b8",
};

type SphereOptions = {
  background: string;
  primary: string;
  withShadow?: boolean;
};

export function kasySphereSvg({
  background,
  primary,
  withShadow = true,
}: SphereOptions): string {
  const shadow = withShadow
    ? `<filter id="s" color-interpolation-filters="sRGB">
        <feDropShadow dx="0" dy="0" stdDeviation="1" flood-color="${primary}" flood-opacity="1"/>
      </filter>`
    : "";

  const filterAttr = withShadow ? ' filter="url(#s)"' : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180"${filterAttr}>
  <defs>
    <linearGradient id="g" gradientTransform="rotate(45)">
      <stop offset="45%" stop-color="${background}"/>
      <stop offset="100%" stop-color="${primary}"/>
    </linearGradient>
    ${shadow}
  </defs>
  <circle cx="90" cy="90" r="90" fill="url(#g)"/>
</svg>`;
}

/** Favicon estático: adapta ao tema do SO (light/dark). */
export function kasySphereSvgAdaptive(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 180 180">
  <defs>
    <style>
      .bg { stop-color: ${LANDING_BACKGROUND_LIGHT}; }
      .fg { stop-color: ${LANDING_PRIMARY_LIGHT}; }
      @media (prefers-color-scheme: dark) {
        .bg { stop-color: ${LANDING_BACKGROUND_DARK}; }
        .fg { stop-color: ${LANDING_PRIMARY_DARK}; }
      }
    </style>
    <linearGradient id="g" gradientTransform="rotate(45)">
      <stop offset="45%" class="bg"/>
      <stop offset="100%" class="fg"/>
    </linearGradient>
  </defs>
  <circle cx="90" cy="90" r="90" fill="url(#g)"/>
</svg>`;
}

export function kasySphereDataUrl(options: SphereOptions): string {
  return `data:image/svg+xml,${encodeURIComponent(kasySphereSvg(options))}`;
}

export function landingFaviconForTheme(isDark: boolean, section = "comece"): string {
  const primary =
    SECTION_FAVICON_COLORS[section] ?? SECTION_FAVICON_COLORS.comece;
  return kasySphereDataUrl({
    background: isDark ? LANDING_BACKGROUND_DARK : LANDING_BACKGROUND_LIGHT,
    primary: isDark ? primary : LANDING_PRIMARY_LIGHT,
  });
}
