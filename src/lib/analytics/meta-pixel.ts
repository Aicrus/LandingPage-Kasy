/**
 * Meta Pixel (Facebook/Instagram Ads).
 *
 * O ID vem de NEXT_PUBLIC_META_PIXEL_ID. Sem a variável o pixel não carrega e
 * todas as chamadas viram no-op — dev e preview ficam limpos de eventos.
 */
import { whenTagReady } from "@/lib/analytics/wait-for-tag";

type MetaEventParams = Record<string, unknown>;
type MetaEventOptions = { eventID?: string };

type Fbq = {
  (...args: unknown[]): void;
  queue?: unknown[];
  loaded?: boolean;
  version?: string;
  callMethod?: (...args: unknown[]) => void;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

export const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID ?? "";

export function isMetaPixelEnabled(): boolean {
  return META_PIXEL_ID.length > 0;
}

/** Dispara um evento padrão do Pixel. */
export function trackMetaEvent(
  name: string,
  params?: MetaEventParams,
  options?: MetaEventOptions,
): void {
  if (!isMetaPixelEnabled()) return;

  whenTagReady(
    () => window.fbq,
    (fbq) => fbq("track", name, params ?? {}, options ?? {}),
  );
}
