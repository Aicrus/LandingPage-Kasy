"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

/** Nota única abaixo dos planos: mensagem + cupom (KASY20 ou KASY10). */
export function RegionalDiscountNote({ code }: { code: string }) {
  const t = useTranslations("pricing.regionalDiscount");
  const [copied, setCopied] = useState(false);

  async function copyCode() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      // Código já visível para copiar manualmente.
    }
  }

  return (
    <p
      className={cn(
        "mt-8 w-full max-w-[44rem] px-2 text-center text-[0.8125rem] leading-none text-muted-foreground",
        "sm:whitespace-nowrap",
      )}
      role="note"
    >
      <span>{t("message")}</span>
      <span className="mx-1.5 text-border" aria-hidden>
        ·
      </span>
      <button
        type="button"
        onClick={copyCode}
        className={cn(
          "relative inline-flex items-center gap-1 overflow-hidden align-baseline",
          "font-mono text-[0.8125rem] font-semibold tracking-wide",
          "underline decoration-primary/35 underline-offset-[3px] hover:decoration-primary/60",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2",
          "motion-safe:animate-[coupon-glow_3.6s_ease-in-out_infinite]",
        )}
        aria-label={copied ? t("copied") : t("copyAria", { code })}
      >
        <span className="relative z-10">{code}</span>
        {copied ? (
          <Check className="relative z-10 size-3 text-primary" strokeWidth={2.5} />
        ) : (
          <Copy
            className="relative z-10 size-3 text-muted-foreground"
            strokeWidth={2}
          />
        )}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-2/5 -skew-x-[12deg] bg-gradient-to-r from-transparent via-primary/50 to-transparent motion-safe:animate-[coupon-shine_3.6s_ease-in-out_infinite]"
        />
      </button>
      <span className="mx-1.5 text-border" aria-hidden>
        ·
      </span>
      <span>{t("hint")}</span>
    </p>
  );
}
