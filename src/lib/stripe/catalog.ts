export type CheckoutPlan = "starter" | "annual";

export type Currency = "usd" | "brl";
export type SiteLocale = "pt" | "en" | "es";

const PLAN_METADATA: Record<CheckoutPlan, string> = {
  starter: "starter",
  annual: "annual",
};

/**
 * Produtos reais da Stripe, um por idioma.
 *
 * O checkout precisa apontar para produtos existentes (e não criar um produto novo
 * a cada sessão) para que cupom restrito a produto funcione. Como a Stripe não
 * traduz nome de produto, cada idioma tem o seu.
 */
export const PLAN_PRODUCT_ID: Record<CheckoutPlan, Record<SiteLocale, string>> = {
  annual: {
    pt: "prod_Up1pRXx1RjEGjS",
    en: "prod_V1GhbXW8ARl6zb",
    es: "prod_V1GhvbzNVBTo8I",
  },
  starter: {
    pt: "prod_V3a5t4CWIt3JgY",
    en: "prod_V3a5tCdaeKMGu3",
    es: "prod_V3a5SqiNDVac6z",
  },
};

export const PLAN_UNIT_AMOUNT: Record<CheckoutPlan, Record<Currency, number>> = {
  annual: { usd: 12300, brl: 62300 },
  // R$249/ano definido pelo usuário; USD proporcional ao ratio BRL/USD do annual (~5x).
  starter: { usd: 4900, brl: 24900 },
};

/** Formata centavos Stripe para vitrine ($98.40 / R$498,40). */
export function formatMoney(cents: number, currency: Currency): string {
  const value = cents / 100;
  if (currency === "brl") {
    const formatted = value.toLocaleString("pt-BR", {
      minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
      maximumFractionDigits: 2,
    });
    return `R$${formatted}`;
  }
  const formatted = value.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(value) ? 0 : 2,
    maximumFractionDigits: 2,
  });
  return `$${formatted}`;
}

export function planAmountWithPercentOff(
  plan: CheckoutPlan,
  currency: Currency,
  percentOff: number,
): string {
  const full = PLAN_UNIT_AMOUNT[plan][currency];
  const discounted = Math.round(full * (1 - percentOff / 100));
  return formatMoney(discounted, currency);
}

const STRIPE_LOCALE: Record<SiteLocale, "pt" | "en" | "es"> = {
  pt: "pt",
  en: "en",
  es: "es",
};

export function isSiteLocale(value: string): value is SiteLocale {
  return value === "pt" || value === "en" || value === "es";
}

export function stripeLocale(locale: SiteLocale): "pt" | "en" | "es" {
  return STRIPE_LOCALE[locale];
}

export function resolveCheckoutLineItem(
  plan: CheckoutPlan,
  country: string | null | undefined,
  locale: SiteLocale,
) {
  const currency = currencyForCountry(country);

  return {
    quantity: 1,
    price_data: {
      currency,
      unit_amount: PLAN_UNIT_AMOUNT[plan][currency],
      // Produto real da Stripe, no idioma do comprador.
      product: PLAN_PRODUCT_ID[plan][locale],
    },
  };
}

export function isBrazil(country: string | null | undefined): boolean {
  return country?.toUpperCase() === "BR";
}

export function currencyForCountry(country: string | null | undefined): Currency {
  return isBrazil(country) ? "brl" : "usd";
}

export function metadataPlan(plan: CheckoutPlan): string {
  return PLAN_METADATA[plan];
}

export function isCheckoutPlan(value: unknown): value is CheckoutPlan {
  return value === "annual" || value === "starter";
}
