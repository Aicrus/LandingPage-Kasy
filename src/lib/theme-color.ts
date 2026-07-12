/**
 * Cor da status bar / safe-area do navegador mobile (meta `theme-color`)
 * e favicon light/dark. Os valores de fundo espelham `--background` do globals.css.
 *
 * Padrão robusto p/ a status bar do iOS Safari (a parte que "travava" no claro):
 *  - UMA única <meta name="theme-color">, sempre MUTANDO o `content`.
 *  - SEM atributo `media`: o tema do site vence o tema do SO.
 *  - Favicon: UMA única <link rel="icon" data-kasy-theme-icon>, mutando `href`.
 *  - Só DOIS atores: 1 script no <head> (primeiro paint) + 1 observer em runtime.
 */
export const THEME_BACKGROUND = {
  light: "#f2f6fc",
  dark: "#0a1220",
} as const;

export const THEME_FAVICON = {
  light: "/assets/favicon-light.png",
  dark: "/assets/favicon-dark.png",
} as const;

type ThemeChrome = {
  background: typeof THEME_BACKGROUND;
  favicon: typeof THEME_FAVICON;
};

const THEME_CHROME: ThemeChrome = {
  background: THEME_BACKGROUND,
  favicon: THEME_FAVICON,
};

/**
 * Primeiro paint — roda no <head> ANTES do body. Lê o mesmo localStorage do
 * next-themes e pinta theme-color + favicon de forma síncrona (sem flash).
 */
export const themeColorHeadInitScript = `(function(c){function d(){try{var t=localStorage.getItem("theme")||"system";return t==="dark"||(t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches)}catch(e){return window.matchMedia("(prefers-color-scheme: dark)").matches}}var dark=d(),color=dark?c.background.dark:c.background.light,href=dark?c.favicon.dark:c.favicon.light,m=document.querySelector('meta[name="theme-color"]:not([media])');if(!m){m=document.createElement("meta");m.name="theme-color";document.head.appendChild(m)}if(m.content!==color){m.content=color}var link=document.querySelector('link[rel="icon"][data-kasy-theme-icon]');if(!link){link=document.createElement("link");link.rel="icon";link.type="image/png";link.setAttribute("data-kasy-theme-icon","true");document.head.appendChild(link)}if(link.getAttribute("href")!==href){link.setAttribute("href",href)}})(${JSON.stringify(THEME_CHROME)})`;

/**
 * Runtime — depois do next-themes. Observa `.dark` no <html> e muta
 * theme-color + favicon. matchMedia cobre troca do SO em modo "system".
 * @see https://github.com/pacocoursey/next-themes/issues/78
 */
export function themeMetaSyncScript(chrome: ThemeChrome = THEME_CHROME) {
  function syncThemeChrome() {
    const dark = document.documentElement.classList.contains("dark");
    const color = dark ? chrome.background.dark : chrome.background.light;
    const href = dark ? chrome.favicon.dark : chrome.favicon.light;

    let meta = document.querySelector<HTMLMetaElement>(
      'meta[name="theme-color"]:not([media])',
    );
    if (!meta) {
      meta = document.createElement("meta");
      meta.name = "theme-color";
      document.head.appendChild(meta);
    }
    if (meta.getAttribute("content") !== color) {
      meta.setAttribute("content", color);
    }

    let link = document.querySelector<HTMLLinkElement>(
      'link[rel="icon"][data-kasy-theme-icon]',
    );
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      link.type = "image/png";
      link.setAttribute("data-kasy-theme-icon", "true");
      document.head.appendChild(link);
    }
    if (link.getAttribute("href") !== href) {
      link.setAttribute("href", href);
    }
  }

  new MutationObserver(syncThemeChrome).observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });

  window
    .matchMedia("(prefers-color-scheme: dark)")
    .addEventListener("change", () => {
      try {
        if ((localStorage.getItem("theme") || "system") === "system") {
          syncThemeChrome();
        }
      } catch {
        /* ignore */
      }
    });

  syncThemeChrome();
}
