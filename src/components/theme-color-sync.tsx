"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

import {
  applyThemeColorMeta,
  type ResolvedThemeMode,
} from "@/lib/theme-color";

export function ThemeColorSync() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !resolvedTheme) return;
    if (resolvedTheme === "light" || resolvedTheme === "dark") {
      applyThemeColorMeta(resolvedTheme as ResolvedThemeMode);
    }
  }, [mounted, resolvedTheme]);

  return null;
}
