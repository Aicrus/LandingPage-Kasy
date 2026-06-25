"use client";

import { Monitor, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";

const themes = ["light", "dark", "system"] as const;

const themeLabels: Record<(typeof themes)[number], string> = {
  light: "Tema claro",
  dark: "Tema escuro",
  system: "Tema do sistema",
};

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme =
    theme === "light" || theme === "dark" || theme === "system"
      ? theme
      : "system";

  const cycleTheme = () => {
    const index = themes.indexOf(currentTheme);
    const nextTheme = themes[(index + 1) % themes.length];
    setTheme(nextTheme);
  };

  const Icon =
    currentTheme === "light"
      ? Sun
      : currentTheme === "dark"
        ? Moon
        : Monitor;

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      className="fixed top-4 right-4 z-50"
      onClick={cycleTheme}
      aria-label={
        mounted ? themeLabels[currentTheme] : "Alternar tema"
      }
      title={mounted ? themeLabels[currentTheme] : undefined}
    >
      {mounted ? (
        <Icon aria-hidden />
      ) : (
        <span className="size-4" aria-hidden />
      )}
    </Button>
  );
}
