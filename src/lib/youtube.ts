/** Vídeo principal do showcase (YouTube). Cole o link ou só o ID. */
export const YOUTUBE_SHOWCASE_VIDEO =
  "https://www.youtube.com/watch?v=PMhNWk_IPGM";

const YOUTUBE_ID_RE =
  /(?:youtu\.be\/|youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/))([A-Za-z0-9_-]{11})/;

export function parseYouTubeVideoId(input: string): string | null {
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (/^[A-Za-z0-9_-]{11}$/.test(trimmed)) return trimmed;
  const match = trimmed.match(YOUTUBE_ID_RE);
  return match?.[1] ?? null;
}

export function getShowcaseYouTubeId(): string | null {
  return parseYouTubeVideoId(YOUTUBE_SHOWCASE_VIDEO);
}

type YouTubeEmbedOptions = {
  /** Autoplay (precisa de mute nos browsers modernos). */
  autoplay?: boolean;
  mute?: boolean;
  /** Preferência de qualidade (melhor esforço; o YouTube pode adaptar). */
  quality?: "hd1080" | "hd720" | "large";
  origin?: string;
  /** enablejsapi=1 para play/pause e desligar legendas via API. */
  enableJsApi?: boolean;
};

/**
 * Embed com preferência 1080p + legendas desligadas.
 * Sem `playlist` (evita botões avançar/voltar). Loop fica a cargo da IFrame API.
 * `vq=hd1080` e player largo aumentam a chance de começar em Full HD.
 */
export function youtubeEmbedSrc(
  videoId: string,
  {
    autoplay = true,
    mute = true,
    quality = "hd1080",
    origin,
    enableJsApi = true,
  }: YouTubeEmbedOptions = {},
): string {
  const params = new URLSearchParams({
    autoplay: autoplay ? "1" : "0",
    mute: mute ? "1" : "0",
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
    controls: "0",
    disablekb: "1",
    fs: "0",
    iv_load_policy: "3",
    // 0 = não forçar legendas; a API ainda desliga tracks/CC ao ready
    cc_load_policy: "0",
    vq: quality,
  });

  if (enableJsApi) params.set("enablejsapi", "1");
  if (origin) params.set("origin", origin);

  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
}

declare global {
  interface Window {
    YT?: {
      Player: new (
        elementId: string | HTMLElement,
        config: Record<string, unknown>,
      ) => YouTubePlayer;
      PlayerState: {
        PLAYING: number;
        PAUSED: number;
        ENDED: number;
        BUFFERING: number;
        CUED: number;
        UNSTARTED: number;
      };
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

export type YouTubePlayer = {
  playVideo: () => void;
  pauseVideo: () => void;
  mute: () => void;
  unMute: () => void;
  setVolume: (volume: number) => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  destroy: () => void;
  unloadModule: (module: string) => void;
  setOption: (module: string, option: string, value: unknown) => void;
  getIframe: () => HTMLIFrameElement;
};

let apiPromise: Promise<void> | null = null;

/** Carrega a IFrame API uma vez. */
export function loadYouTubeIframeApi(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.YT?.Player) return Promise.resolve();

  if (!apiPromise) {
    apiPromise = new Promise((resolve) => {
      const previous = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        previous?.();
        resolve();
      };

      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.head.appendChild(script);
      }
    });
  }

  return apiPromise;
}

/** Remove legendas (CC) e tracks auto, o máximo que a API permite. */
export function disableYouTubeCaptions(player: YouTubePlayer) {
  try {
    player.unloadModule("captions");
  } catch {
    /* ignore */
  }
  try {
    player.unloadModule("cc");
  } catch {
    /* ignore */
  }
  try {
    player.setOption("captions", "track", {});
  } catch {
    /* ignore */
  }
}
