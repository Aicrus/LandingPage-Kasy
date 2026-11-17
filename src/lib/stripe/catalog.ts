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
  annual: { usd: 9900, brl: 49700 },
  // Solo R$197, Founder R$497 (reduzidos em 2026-11-17); USD ~5x menor que o BRL.
  starter: { usd: 3900, brl: 19700 },
};

/**
 * Kit Founder é assinatura anual (renova sozinho no cartão). A renovação custa
 * menos que o 1º ano: quem já é cliente paga o valor de renovação. No Checkout
 * isso vira 2 itens: a assinatura (valor de renovação) + a "adesão" do 1º ano
 * (diferença, cobrada uma única vez). Solo continua pagamento único (90 dias).
 */
export const FOUNDER_RENEWAL_AMOUNT: Record<Currency, number> = { usd: 7900, brl: 39700 };

export function isSubscriptionPlan(plan: CheckoutPlan): boolean {
  return plan === "annual";
}

const FIRST_YEAR_ITEM_NAME: Record<SiteLocale, string> = {
  pt: "Kit Founder: adesão do 1º ano (cobrança única)",
  en: "Kit Founder: first-year setup (one-time)",
  es: "Kit Founder: alta del 1.er año (pago único)",
};

/** Texto no botão de pagar do Checkout: deixa a renovação explícita. */
export function renewalSubmitMessage(country: string | null | undefined, locale: SiteLocale): string {
  const currency = currencyForCountry(country);
  const price = formatMoney(FOUNDER_RENEWAL_AMOUNT[currency], currency);
  if (locale === "pt") {
    return `Renova sozinho a cada ano por ${price}, no mesmo cartão. Cancele quando quiser, sem login, pelo link no e-mail da compra.`;
  }
  if (locale === "es") {
    return `Se renueva solo cada año por ${price}, en la misma tarjeta. Cancela cuando quieras, sin iniciar sesión, desde el enlace del correo de compra.`;
  }
  return `Renews automatically every year for ${price} on the same card. Cancel anytime, no login, from the link in your purchase email.`;
}

/** Itens do Checkout: 1 item (pagamento único) ou 2 (assinatura + adesão do 1º ano). */
export function resolveCheckoutLineItems(
  plan: CheckoutPlan,
  country: string | null | undefined,
  locale: SiteLocale,
) {
  if (!isSubscriptionPlan(plan)) {
    return [resolveCheckoutLineItem(plan, country, locale)];
  }
  const currency = currencyForCountry(country);
  const renewal = FOUNDER_RENEWAL_AMOUNT[currency];
  const firstYearExtra = PLAN_UNIT_AMOUNT[plan][currency] - renewal;
  return [
    {
      quantity: 1,
      price_data: {
        currency,
        unit_amount: renewal,
        product: PLAN_PRODUCT_ID[plan][locale],
        recurring: { interval: "year" as const },
      },
    },
    {
      quantity: 1,
      price_data: {
        currency,
        unit_amount: firstYearExtra,
        product_data: { name: FIRST_YEAR_ITEM_NAME[locale] },
      },
    },
  ];
}

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
