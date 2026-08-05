"use client";

import { useEffect } from "react";

import { trackPurchase } from "@/lib/analytics/events";

type PurchaseTrackerProps = {
  /** ID da sessão do Stripe: dedupe do evento e chave do F5 na página. */
  eventId: string;
  plan: string;
  valueCents?: number;
  currency?: string;
};

/**
 * Dispara a conversão de compra uma única vez por sessão de checkout, mesmo que
 * a pessoa recarregue a página de sucesso.
 */
export function PurchaseTracker({
  eventId,
  plan,
  valueCents,
  currency,
}: PurchaseTrackerProps) {
  useEffect(() => {
    const storageKey = `purchase-tracked:${eventId}`;
    try {
      if (window.sessionStorage.getItem(storageKey)) return;
      window.sessionStorage.setItem(storageKey, "1");
    } catch {
      // sessionStorage bloqueado: melhor arriscar duplicar do que perder a venda.
    }

    trackPurchase({ eventId, plan, valueCents, currency });
  }, [eventId, plan, valueCents, currency]);

  return null;
}
