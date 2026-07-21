/** Carrega Player.js (Bunny CDN) uma vez. */
let playerJsPromise: Promise<void> | null = null;

export type PlayerJsPlayer = {
  on: (event: string, cb: (data?: unknown) => void) => void;
  off: (event: string, cb?: (data?: unknown) => void) => void;
  play: () => void;
  pause: () => void;
  mute: () => void;
  unmute: () => void;
  setVolume: (value: number) => void;
  setCurrentTime: (seconds: number) => void;
  getPaused: (cb: (paused: boolean) => void) => void;
  supports: (type: "method" | "event", name: string) => boolean;
};

declare global {
  interface Window {
    playerjs?: {
      Player: new (iframe: HTMLIFrameElement | string) => PlayerJsPlayer;
    };
  }
}

const PLAYER_JS_SRC =
  "https://assets.mediadelivery.net/playerjs/playerjs-latest.min.js";

export function loadPlayerJs(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  if (window.playerjs?.Player) return Promise.resolve();
  if (playerJsPromise) return playerJsPromise;

  playerJsPromise = new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(
      `script[src="${PLAYER_JS_SRC}"]`,
    );
    if (existing) {
      existing.addEventListener("load", () => resolve(), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error("Falha ao carregar Player.js")),
        { once: true },
      );
      if (window.playerjs?.Player) resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = PLAYER_JS_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      playerJsPromise = null;
      reject(new Error("Falha ao carregar Player.js"));
    };
    document.head.appendChild(script);
  });

  return playerJsPromise;
}
