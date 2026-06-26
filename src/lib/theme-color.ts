/** Mesmos valores de --background em globals.css */
export const THEME_BACKGROUND = {
  light: "#f2f4fa",
  dark: "#0f1218",
} as const;

export type ResolvedThemeMode = keyof typeof THEME_BACKGROUND;

export function themeColorForMode(mode: ResolvedThemeMode) {
  return THEME_BACKGROUND[mode];
}

/** Atualiza uma única meta theme-color (sem media query). */
export function applyThemeColorMeta(mode: ResolvedThemeMode) {
  if (typeof document === "undefined") return;

  const color = themeColorForMode(mode);
  const existing = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]',
  );

  if (
    existing &&
    existing.content === color &&
    !existing.hasAttribute("media")
  ) {
    return;
  }

  document
    .querySelectorAll('meta[name="theme-color"]')
    .forEach((meta) => meta.remove());

  const meta = document.createElement("meta");
  meta.name = "theme-color";
  meta.content = color;
  document.head.appendChild(meta);
}

/**
 * Primeiro paint — lê o mesmo localStorage do next-themes, antes do body.
 * Sem media query: iOS não pode ignorar o tema escolhido no site.
 */
export const themeColorHeadInitScript = `(function(c){function d(){try{var t=localStorage.getItem("theme")||"system";return t==="dark"||(t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches)}catch(e){return window.matchMedia("(prefers-color-scheme: dark)").matches}}function s(){var color=d()?c.dark:c.light;document.querySelectorAll('meta[name="theme-color"]').forEach(function(m){m.remove()});var m=document.createElement("meta");m.name="theme-color";m.content=color;document.head.appendChild(m)}s()})(${JSON.stringify(THEME_BACKGROUND)})`;

/**
 * Depois do script do next-themes — observa a classe no <html>.
 * @see https://github.com/pacocoursey/next-themes/issues/78
 */
export function themeMetaSyncScript(colors: typeof THEME_BACKGROUND) {
  function modeFromDom(): "light" | "dark" {
    return document.documentElement.classList.contains("dark")
      ? "dark"
      : "light";
  }

  function syncThemeColor() {
    const mode = modeFromDom();
    const color = colors[mode];
    const existing = document.querySelector('meta[name="theme-color"]');

    if (
      existing &&
      existing.getAttribute("content") === color &&
      !existing.hasAttribute("media")
    ) {
      return;
    }

    document
      .querySelectorAll('meta[name="theme-color"]')
      .forEach((meta) => meta.remove());

    const meta = document.createElement("meta");
    meta.name = "theme-color";
    meta.content = color;
    document.head.appendChild(meta);
  }

  const htmlObserver = new MutationObserver(syncThemeColor);
  htmlObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      try {
        if ((localStorage.getItem("theme") || "system") === "system") {
          syncThemeColor();
        }
      } catch {
        /* ignore */
      }
    });

  syncThemeColor();
}
