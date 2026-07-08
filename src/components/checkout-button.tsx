"use client";

import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import type { CheckoutPlan } from "@/lib/stripe/catalog";
import { cn } from "@/lib/utils";

type CheckoutButtonProps = {
  plan: CheckoutPlan;
  locale: string;
  className?: string;
  variant?: "default" | "outline";
  children: React.ReactNode;
};

export function CheckoutButton({
  plan,
  locale,
  className,
  variant = "default",
  children,
}: CheckoutButtonProps) {
  const t = useTranslations("pricing");
  const [loading, setLoading] = useState(false);

  async function handleCheckout() {
    setLoading(true);

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
