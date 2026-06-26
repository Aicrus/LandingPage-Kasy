---
name: mobile-theme-color
description: Como fazer a barra do navegador mobile (meta theme-color — status bar do iOS Safari e toolbar do Android Chrome) acompanhar os modos claro, escuro e sistema, batendo com o --background da página. Use ao montar OU corrigir o tema em sites Next.js (App Router) + next-themes quando a parte de cima do navegador fica na cor errada (ex.: travada no claro mesmo no modo escuro).
---

# Mobile theme-color (status bar claro · escuro · sistema)

## O que essa skill resolve

A faixa do topo do navegador no celular — **status bar no iOS Safari**, **toolbar/barra de endereço no Android Chrome** — é pintada pela `<meta name="theme-color">`. O sintoma clássico: a página vira escura, mas o topo do navegador **fica travado na cor clara** (ou vice-versa). O objetivo é que essa cor sempre bata com o `--background` da página nos três modos: **claro, escuro e sistema** (inclusive quando o usuário força um tema no site diferente do tema do dispositivo).

## As 4 regras inegociáveis

1. **UMA única `<meta name="theme-color">`.** Nunca ter duas. Nunca ter variantes.
2. **Sempre MUTAR o `content`** dessa meta. **Nunca** remover e recriar a meta. → O iOS Safari trava na cor antiga quando a meta é removida/recriada; mutar `content` é a única forma confiável de ele atualizar a status bar.
3. **SEM atributo `media`.** Nada de `<meta name="theme-color" media="(prefers-color-scheme: dark)">`. → Com `media`, o navegador segue só o tema do **sistema** e **ignora** o toggle do site. Queremos que o tema escolhido no site vença.
4. **Só DOIS atores, sem concorrência:**
   - **1 script no `<head>`** para o primeiro paint (evita flash de cor errada).
   - **1 observer em runtime** que reage à classe `.dark` do `<html>`.
   - **Nada de sync paralelo no React** (`useEffect` com `resolvedTheme`), e **o toggle NÃO pinta a meta na mão**. Cada ator extra é um concorrente que causa corrida e volta a travar o iOS.

> Causa raiz do bug "travado no claro": múltiplos atualizadores fazendo `querySelectorAll('meta[name=theme-color]').forEach(remove)` + `createElement` ao mesmo tempo. Some os atores e troque remove/recreate por mutação de `content`.

## Implementação (Next.js App Router + next-themes)

### 1. `src/lib/theme-color.ts`

As cores **espelham `--background`** do `globals.css` (`:root` = claro, `.dark` = escuro). Ajuste os hex para o projeto.

```ts
/** Mesmos valores de --background em globals.css */
export const THEME_BACKGROUND = {
  light: "#f2f4fa", // = :root --background
  dark: "#0f1218",  // = .dark --background
} as const;

/**
 * Primeiro paint — roda no <head> ANTES do body. Lê o mesmo localStorage do
 * next-themes ("theme") e pinta a meta de forma síncrona (sem flash).
 * Precisa ser <script> cru (não React) p/ a hidratação não reverter o content.
 */
export const themeColorHeadInitScript = `(function(c){function d(){try{var t=localStorage.getItem("theme")||"system";return t==="dark"||(t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches)}catch(e){return window.matchMedia("(prefers-color-scheme: dark)").matches}}var color=d()?c.dark:c.light,m=document.querySelector('meta[name="theme-color"]:not([media])');if(!m){m=document.createElement("meta");m.name="theme-color";document.head.appendChild(m)}if(m.content!==color){m.content=color}})(${JSON.stringify(THEME_BACKGROUND)})`;

/**
 * Runtime — depois do next-themes. Observa a classe do <html> (sinal canônico:
 * next-themes alterna `.dark` tanto no toggle manual quanto no modo "system")
 * e MUTA o content da meta única. matchMedia cobre a troca de tema do SO
 * enquanto o site está em "system".
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
```

### 2. `src/components/theme-meta-sync.tsx`

Injeta o observer como `<script>` inline (server component, sem `"use client"`).

```tsx
import { THEME_BACKGROUND, themeMetaSyncScript } from "@/lib/theme-color";

export function ThemeMetaSyncScript() {
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(${themeMetaSyncScript.toString()})(${JSON.stringify(THEME_BACKGROUND)})`,
      }}
    />
  );
}
```

### 3. `src/app/layout.tsx` (ligação)

```tsx
import { ThemeMetaSyncScript } from "@/components/theme-meta-sync";
import { ThemeProvider } from "@/components/theme-provider";
import { themeColorHeadInitScript } from "@/lib/theme-color";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        {/* 1º paint — antes do body, sem flash de cor errada */}
        <script dangerouslySetInnerHTML={{ __html: themeColorHeadInitScript }} />
      </head>
      <body>
        <ThemeProvider>
          <ThemeMetaSyncScript /> {/* observer único em runtime */}
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
```

`ThemeProvider` é o `next-themes` padrão (`attribute="class"`, `defaultTheme="system"`, `enableSystem`, `enableColorScheme`, `disableTransitionOnChange`). `suppressHydrationWarning` no `<html>` é obrigatório.

### 4. Toggle de tema

O botão de tema **só** chama `setTheme(...)` do next-themes. **Não** importe nem chame nada de `theme-color` aqui — o observer já reage à mudança da classe `.dark`. Pintar a meta na mão aqui recria o bug.

## Anti-padrões (NÃO faça)

- ❌ Componente React com `useEffect`/`resolvedTheme` chamando um `applyThemeColorMeta`.
- ❌ Chamar a sincronização da meta dentro do `onClick` do toggle.
- ❌ `forEach(meta => meta.remove())` + `createElement` a cada troca.
- ❌ Duas metas com `media="(prefers-color-scheme: ...)"`.
- ❌ Renderizar `<meta name="theme-color">` no JSX/metadata do React (a hidratação reverte o `content` mutado pelo script → volta a travar).

## Notas por navegador

- **iOS Safari (15+):** pinta a status bar. É o exigente — só ele expõe o bug de remove/recreate. Mutar `content` é o que funciona.
- **Android Chrome:** pinta a toolbar; atualiza dinamicamente de forma mais tolerante, mas usa a mesma meta e se beneficia da mesma implementação.
- **Desktop:** em geral ignora `theme-color` (é recurso de mobile).
- A regra "sem `media`" vale para iOS **e** Android: é o que faz o toggle do site vencer o tema do SO.

## Checklist de verificação

1. No HTML servido, existe **exatamente um** padrão de meta `theme-color` por script e **nenhum** `.remove()` de theme-color. Conferir:
   - `curl -s http://localhost:3000 | grep -o 'meta\[name="theme-color"\]:not(\[media\])'` → deve aparecer (head + observer), e
   - `... | grep -c 'theme-color.*forEach\|forEach.*remove'` → deve ser `0`.
2. No celular (ou DevTools mobile): alternar claro → escuro → sistema; o topo do navegador acompanha **na hora**, sem flash ao recarregar.
3. Forçar no site o tema **oposto** ao do dispositivo (ex.: site em dark, celular em light): o topo segue o **site**, não o sistema.
