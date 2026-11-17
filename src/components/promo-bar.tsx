"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";

import type { SitePromo } from "@/lib/promo";
import { cn } from "@/lib/utils";

/**
 * Faixa fina fixa no topo (acima do menu). Altura = --promo-bar-h, que o
 * layout liga com a classe `has-promo-bar` no <html> para empurrar o menu.
 * Mobile: fixed (o menu também é fixed). sm+: sticky no fluxo.
 */
export function PromoBar({ promo }: { promo: SitePromo }) {
  const t = useTranslations("promoBar");
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(promo.code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // O código continua visível para copiar à mão.
    }
  }

  return (
    <div
      role="region"
      aria-label={t("aria", { percent: promo.percent })}
      className={cn(
        "promo-bar inset-x-0 top-0 z-[60] flex h-[var(--promo-bar-h)] w-full items-center justify-center px-3",
        "max-sm:fixed sm:sticky",
      )}
    >
      <div className="flex min-w-0 items-center gap-2.5 text-[0.75rem] leading-none sm:gap-3 sm:text-[0.8125rem]">
        <span className="promo-bar-tag shrink-0 rounded-full px-2 py-[0.3rem] text-[0.625rem] font-semibold uppercase tracking-[0.14em]">
          {t("tag")}
        </span>
        <span className="truncate font-medium text-[var(--promo-bar-fg)]">
          <span className="font-semibold">{t("percent", { percent: promo.percent })}</span>
          <span className="hidden text-[var(--promo-bar-muted)] sm:inline"> {t("limited")}</span>
        </span>
        <button
          type="button"
          onClick={copyCode}
          aria-label={copied ? t("copied") : t("copyAria", { code: promo.code })}
          className={cn(
            "promo-bar-chip relative inline-flex shrink-0 items-center gap-1.5 overflow-hidden rounded-md px-2 py-[0.3rem]",
            "font-mono text-[0.6875rem] font-semibold tracking-wider sm:text-[0.75rem]",
            "transition-colors outline-none focus-visible:ring-2 focus-visible:ring-white/50",
          )}
        >
          <span className="relative z-10">{promo.code}</span>
          {copied ? (
            <Check className="relative z-10 size-3" strokeWidth={2.5} />
          ) : (
            <Copy className="relative z-10 size-3 opacity-70" strokeWidth={2} />
          )}
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-2/5 -skew-x-[12deg] bg-gradient-to-r from-transparent via-white/25 to-transparent motion-safe:animate-[coupon-shine_3.6s_ease-in-out_infinite]"
          />
        </button>
      </div>
    </div>
  );
}
