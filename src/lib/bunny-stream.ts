import { routing } from "@/i18n/routing";

type SiteLocale = (typeof routing.locales)[number];

/** Biblioteca Bunny Stream da Kasy. */
export const BUNNY_LIBRARY_ID = "710273";

/**
 * Vídeo do showcase por idioma da página.
 * ES e EN: placeholder (mesmo GUID do PT) até o Paulo passar os IDs.
 */
export const SHOWCASE_VIDEO_BY_LOCALE: Record<SiteLocale, string> = {
  pt: "1bc2b299-adfe-40f8-a7ef-362e7c08f53b",
  en: "96927239-bcd9-4716-b771-0cf5b9a1b18d",
  es: "c235059a-de06-4ccd-84d5-8bf81508881b",
};

export type BunnyEmbedOptions = {
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
  preload?: boolean;
  /** UI mais enxuta (menos chrome). */
  compactControls?: boolean;
  showSpeed?: boolean;
  playsinline?: boolean;
  rememberPosition?: boolean;
  /** Habilita bridge Player.js (play/pause externo). */
  playerjs?: boolean;
  /** Tempo inicial (ex.: `0s`). */
  startAt?: string;
  /**
   * Sufixo único na URL (Player.js exige `src` único
   * quando há mais de um player na página).
   */
  instanceKey?: string;
};

export function getShowcaseVideoId(locale: string): string {
  if (locale in SHOWCASE_VIDEO_BY_LOCALE) {
    return SHOWCASE_VIDEO_BY_LOCALE[locale as SiteLocale];
  }
  return SHOWCASE_VIDEO_BY_LOCALE.pt;
}

/** URL do iframe Bunny Stream. */
export function bunnyEmbedSrc(
  videoId: string,
  {
    autoplay = true,
    muted = false,
    loop = false,
    preload = true,
    compactControls = true,
    showSpeed = false,
    playsinline = true,
    rememberPosition = false,
    playerjs = true,
    startAt,
    instanceKey,
  }: BunnyEmbedOptions = {},
): string {
  const params = new URLSearchParams({
    autoplay: String(autoplay),
    muted: String(muted),
    loop: String(loop),
    preload: String(preload),
    responsive: "true",
    compactControls: String(compactControls),
    showSpeed: String(showSpeed),
    playsinline: String(playsinline),
    rememberPosition: String(rememberPosition),
    playerjs: String(playerjs),
  });

  if (startAt) params.set("t", startAt);
  if (instanceKey) params.set("_k", instanceKey);

  return `https://player.mediadelivery.net/embed/${BUNNY_LIBRARY_ID}/${videoId}?${params.toString()}`;
}
