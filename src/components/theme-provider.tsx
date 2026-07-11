"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

/**
 * next-themes injeta um <script> inline para evitar flash de tema.
 * No React 19 / Next 16 isso gera um console.error falso positivo
 * (o script roda no HTML do SSR; no client o aviso é só ruído).
 * @see https://github.com/shadcn-ui/ui/issues/10104
 */
function suppressNextThemesScriptWarning() {
  if (process.env.NODE_ENV !== "development") return;
  if (typeof window === "undefined") return;

  const key = "__kasy_suppress_theme_script_warning__";
  if ((window as unknown as Record<string, boolean>)[key]) return;
  (window as unknown as Record<string, boolean>)[key] = true;

  const original = console.error;
  console.error = (...args: unknown[]) => {
    const text = args
      .map((arg) => (typeof arg === "string" ? arg : ""))
      .join(" ");
    if (text.includes("Encountered a script tag")) return;
    original.apply(console, args);
  };
}

suppressNextThemesScriptWarning();

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      enableColorScheme
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
