/**
 * Google Analytics 4 e Google Ads — as duas tags saem do mesmo gtag.js.
 *
 * NEXT_PUBLIC_GA_MEASUREMENT_ID  -> G-XXXXXXXXXX (relatórios)
 * NEXT_PUBLIC_GOOGLE_ADS_ID      -> AW-XXXXXXXXX (conversões de anúncio)
 * Os rótulos de conversão do Ads são opcionais: sem eles só o GA4 registra.
 */
import { whenTagReady } from "@/lib/analytics/wait-for-tag";

type GtagParams = Record<string, unknown>;
type Gtag = (...args: unknown[]) => void;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: Gtag;
  }
}

export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";
export const GOOGLE_ADS_ID = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID ?? "";
export const GOOGLE_ADS_PURCHASE_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_PURCHASE_LABEL ?? "";
export const GOOGLE_ADS_CHECKOUT_LABEL =
  process.env.NEXT_PUBLIC_GOOGLE_ADS_CHECKOUT_LABEL ?? "";

export function isGoogleEnabled(): boolean {
  return GA_MEASUREMENT_ID.length > 0 || GOOGLE_ADS_ID.length > 0;
}

/** ID usado no src do gtag.js; os demais entram via config. */
export function googleTagSrcId(): string {
  return GA_MEASUREMENT_ID || GOOGLE_ADS_ID;
}

export function trackGoogleEvent(name: string, params?: GtagParams): void {
  if (!isGoogleEnabled()) return;

  whenTagReady(
    () => window.gtag,
    (gtag) => gtag("event", name, params ?? {}),
  );
}

/** Conversão do Google Ads. Sem rótulo configurado, não faz nada. */
export function trackGoogleAdsConversion(
  label: string,
  params?: GtagParams,
): void {
  if (!GOOGLE_ADS_ID || !label) return;

  trackGoogleEvent("conversion", {
    send_to: `${GOOGLE_ADS_ID}/${label}`,
    ...params,
  });
}
