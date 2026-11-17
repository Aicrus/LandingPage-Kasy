"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { trackBeginCheckout } from "@/lib/analytics/events";
import type { CheckoutPlan, Currency } from "@/lib/stripe/catalog";
import { cn } from "@/lib/utils";

type CheckoutButtonProps = {
  plan: CheckoutPlan;
  locale: string;
  className?: string;
  variant?: "default" | "outline";
  /** Valor cobrado, para o InitiateCheckout sair com valor real. */
  valueCents?: number;
  currency?: Currency;
  children: React.ReactNode;
};

export function CheckoutButton({
  plan,
  locale,
  className,
  variant = "default",
  valueCents,
  currency,
  children,
}: CheckoutButtonProps) {
  const t = useTranslations("pricing");
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);

    // Checkout em nova aba para a LP continuar aberta. A aba precisa abrir
    // AGORA, no clique: aberta depois do fetch, o Safari trata como pop-up e
    // bloqueia. Ela recebe o link da Stripe quando ele chegar.
    const checkoutTab = openPendingTab(t("checkoutLoading"));

    // Antes do fetch: a ida ao Stripe dá tempo de sobra para os pixels saírem.
    trackBeginCheckout({ plan, valueCents, currency });

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, locale }),
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        throw new Error(data.error ?? "checkout_failed");
      }

      if (checkoutTab && !checkoutTab.closed) {
        checkoutTab.location.href = data.url;
        setLoading(false);
      } else {
        // Navegador bloqueou a aba nova: segue na mesma aba (comportamento antigo).
        window.location.assign(data.url);
      }
    } catch (error) {
      console.error("[checkout-button]", error);
      checkoutTab?.close();
      setLoading(false);
    }
  }

  return (
    <Button
      type="button"
      variant={variant}
      disabled={loading}
      aria-busy={loading}
      className={cn(className)}
      onClick={handleCheckout}
    >
      {loading ? (
        <>
          <Loader2 className="size-4 animate-spin" aria-hidden />
          {t("checkoutLoading")}
        </>
      ) : (
        children
      )}
    </Button>
  );
}

/** Abre uma aba em branco com um aviso de carregamento (null se bloqueada). */
function openPendingTab(message: string): Window | null {
  const tab = window.open("", "_blank");
  if (!tab) return null;
  try {
    tab.opener = null;
    tab.document.title = message;
    tab.document.body.style.cssText =
      "margin:0;height:100vh;display:flex;align-items:center;justify-content:center;font:15px system-ui,sans-serif;color:#6b7a90;background:#f2f6fc";
    tab.document.body.textContent = message;
  } catch {
    // Aba em branco sem aviso: não impede o checkout.
  }
  return tab;
}
