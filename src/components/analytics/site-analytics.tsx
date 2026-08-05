"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { GoogleTagScript } from "@/components/analytics/google-tag";
import { MetaPixelScript } from "@/components/analytics/meta-pixel";
import { TiktokPixelScript } from "@/components/analytics/tiktok-pixel";
import { trackPageView } from "@/lib/analytics/events";

/**
 * Único ponto de entrada de rastreamento do site. Cada script só entra se a
 * variável de ambiente do respectivo pixel existir.
 */
export function SiteAnalytics() {
  const pathname = usePathname();
  const isFirstRender = useRef(true);

  // Os snippets já mandam a primeira visualização; aqui cobrimos as trocas de
  // rota client-side, que não recarregam a página.
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    trackPageView();
  }, [pathname]);

  return (
    <>
      <MetaPixelScript />
      <GoogleTagScript />
      <TiktokPixelScript />
    </>
  );
}
