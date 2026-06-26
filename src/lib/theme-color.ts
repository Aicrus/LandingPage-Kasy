/**
 * Cor da status bar / safe-area do navegador mobile (meta `theme-color`).
 * Os valores espelham `--background` do globals.css.
 *
 * Padrão robusto p/ a status bar do iOS Safari (a parte que "travava" no claro):
 *  - UMA única <meta name="theme-color">, sempre MUTANDO o `content`.
 *    Remover/recriar a meta — ou ter várias — faz o iOS travar na cor antiga.
 *  - SEM atributo `media`: assim o tema escolhido no site vence o tema do SO
 *    (com `media`, o iOS seguiria só o sistema e ignoraria o toggle do site).
 *  - Só DOIS atores, sem concorrência: 1 script no <head> p/ o primeiro paint
 *    (sem flash) e 1 observer em runtime. Nada de sync paralelo no React.
 */
export const THEME_BACKGROUND = {
  light: "#f2f4fa",
  dark: "#0f1218",
} as const;

/**
 * Primeiro paint — roda no <head> ANTES do body. Lê o mesmo localStorage do
 * next-themes e pinta a meta de forma síncrona, evitando flash de cor errada.
 * Precisa ser <script> cru (não React) p/ a hidratação não reverter o content.
 */
export const themeColorHeadInitScript = `(function(c){function d(){try{var t=localStorage.getItem("theme")||"system";return t==="dark"||(t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches)}catch(e){return window.matchMedia("(prefers-color-scheme: dark)").matches}}var color=d()?c.dark:c.light,m=document.querySelector('meta[name="theme-color"]:not([media])');if(!m){m=document.createElement("meta");m.name="theme-color";document.head.appendChild(m)}if(m.content!==color){m.content=color}})(${JSON.stringify(THEME_BACKGROUND)})`;

/**
 * Runtime — roda depois do next-themes. Observa a classe do <html> (sinal
 * canônico: o next-themes alterna `.dark` tanto no toggle manual quanto no modo
 * "system") e MUTA o content da meta única. O matchMedia cobre a troca de tema
 * do SO enquanto o site está em "system".
 * @see https://github.com/pacocoursey/next-themes/issues/78
 */
export function themeMetaSyncScript(colors: typeof THEME_BACKGROUND) {
  function syncThemeColor() {
    const color = document.documentElement.classList.contains("dark")
      ? colors.dark
      : colors.light;

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
  }

  new MutationObserver(syncThemeColor).observe(document.documentElement, {
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
