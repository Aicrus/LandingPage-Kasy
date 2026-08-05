/**
 * Camada única de eventos: um clique no site vira o evento equivalente em cada
 * plataforma de anúncio ligada (Meta, Google Analytics/Ads, TikTok).
 *
 * Valores entram sempre em centavos, como o Stripe devolve.
 */
import {
  GOOGLE_ADS_CHECKOUT_LABEL,
  GOOGLE_ADS_PURCHASE_LABEL,
  trackGoogleAdsConversion,
  trackGoogleEvent,
} from "@/lib/analytics/google";
import { trackMetaEvent } from "@/lib/analytics/meta-pixel";
import { trackTiktokEvent, trackTiktokPageView } from "@/lib/analytics/tiktok";
import { centsToAmount } from "@/lib/analytics/wait-for-tag";

type PurchaseInput = {
  /** ID da sessão do Stripe: dedupe entre pixel e futura API de conversões. */
  eventId: string;
  plan: string;
  valueCents?: number;
  currency?: string;
};

type CheckoutInput = {
  plan: string;
  valueCents?: number;
  currency?: string;
};

function money(valueCents?: number, currency?: string) {
  if (valueCents === undefined || !currency) return null;
  return { value: centsToAmount(valueCents), currency: currency.toUpperCase() };
}

export function trackPageView(): void {
  trackMetaEvent("PageView");
  trackGoogleEvent("page_view", {
    page_path: window.location.pathname,
    page_location: window.location.href,
    page_title: document.title,
  });
  trackTiktokPageView();
}

export function trackBeginCheckout({
  plan,
  valueCents,
  currency,
}: CheckoutInput): void {
  const amount = money(valueCents, currency);

  trackMetaEvent("InitiateCheckout", {
    content_name: plan,
    content_type: "product",
    ...(amount ?? {}),
  });

  trackGoogleEvent("begin_checkout", {
    ...(amount ?? {}),
    items: [{ item_id: plan, item_name: plan, quantity: 1 }],
  });
  trackGoogleAdsConversion(GOOGLE_ADS_CHECKOUT_LABEL, amount ?? {});

  trackTiktokEvent("InitiateCheckout", {
    ...(amount ?? {}),
    contents: [{ content_id: plan, content_type: "product", content_name: plan }],
  });
}

export function trackPurchase({
  eventId,
  plan,
  valueCents,
  currency,
}: PurchaseInput): void {
  const amount = money(valueCents, currency);

  trackMetaEvent(
    "Purchase",
    { content_name: plan, content_type: "product", ...(amount ?? {}) },
    { eventID: eventId },
  );

  trackGoogleEvent("purchase", {
    transaction_id: eventId,
    ...(amount ?? {}),
    items: [
      {
        item_id: plan,
        item_name: plan,
        quantity: 1,
        ...(amount ? { price: amount.value } : {}),
      },
    ],
  });
  trackGoogleAdsConversion(GOOGLE_ADS_PURCHASE_LABEL, {
    transaction_id: eventId,
    ...(amount ?? {}),
  });

  trackTiktokEvent(
    "CompletePayment",
    {
      ...(amount ?? {}),
      contents: [
        { content_id: plan, content_type: "product", content_name: plan },
      ],
    },
    { event_id: eventId },
  );
}
