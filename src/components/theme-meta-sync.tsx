"use client";

import { useEffect } from "react";

import { themeMetaSyncScript } from "@/lib/theme-color";

/** Runtime sync of theme-color + favicon. Head init lives in the locale layout. */
export function ThemeMetaSyncScript() {
  useEffect(() => {
    themeMetaSyncScript();
  }, []);

  return null;
}
