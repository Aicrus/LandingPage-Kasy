/**
 * TikTok Pixel. ID em NEXT_PUBLIC_TIKTOK_PIXEL_ID; sem ele nada carrega.
 */
import { whenTagReady } from "@/lib/analytics/wait-for-tag";

type TiktokEventParams = Record<string, unknown>;
type TiktokEventOptions = { event_id?: string };

type Ttq = {
  page: (...args: unknown[]) => void;
  track: (
    name: string,
    params?: TiktokEventParams,
    options?: TiktokEventOptions,
  ) => void;
};

declare global {
  interface Window {
    ttq?: Ttq;
    TiktokAnalyticsObject?: string;
  }
}

export const TIKTOK_PIXEL_ID = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID ?? "";

export function isTiktokPixelEnabled(): boolean {
  return TIKTOK_PIXEL_ID.length > 0;
}

export function trackTiktokEvent(
  name: string,
  params?: TiktokEventParams,
  options?: TiktokEventOptions,
): void {
  if (!isTiktokPixelEnabled()) return;

  whenTagReady(
    () => window.ttq,
    (ttq) => ttq.track(name, params ?? {}, options ?? {}),
  );
}

export function trackTiktokPageView(): void {
  if (!isTiktokPixelEnabled()) return;

  whenTagReady(
    () => window.ttq,
    (ttq) => ttq.page(),
  );
}
