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

      window.location.assign(data.url);
    } catch (error) {
      console.error("[checkout-button]", error);
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
