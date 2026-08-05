const RETRY_DELAY_MS = 250;
const MAX_RETRIES = 20;

/**
 * Os scripts de anúncio carregam depois da página, e um clique pode acontecer
 * antes disso. Espera a tag aparecer por ~5s antes de desistir do evento.
 */
export function whenTagReady<T>(
  getTag: () => T | undefined | null,
  run: (tag: T) => void,
  attempt = 0,
): void {
  if (typeof window === "undefined") return;

  const tag = getTag();
  if (tag) {
    run(tag);
    return;
  }

  if (attempt >= MAX_RETRIES) return;
  window.setTimeout(() => whenTagReady(getTag, run, attempt + 1), RETRY_DELAY_MS);
}

/** Centavos Stripe -> valor em unidades monetárias, como as plataformas esperam. */
export function centsToAmount(cents: number): number {
  return Math.round(cents) / 100;
}
