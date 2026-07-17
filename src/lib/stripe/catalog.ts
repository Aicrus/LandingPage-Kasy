export type CheckoutPlan = "annual" | "kitCourse";

export type Currency = "usd" | "brl";
export type SiteLocale = "pt" | "en" | "es";

export const PLAN_DISPLAY = {
  annual: {
    usd: { amount: "$123", perKey: "perYear" as const },
    brl: { amount: "R$623", perKey: "perYear" as const },
  },
  kitCourse: {
    usd: { amount: "$187", perKey: "oneTime" as const },
    brl: { amount: "R$997", perKey: "oneTime" as const },
  },
} satisfies Record<
  CheckoutPlan,
  Record<Currency, { amount: string; perKey: "perYear" | "oneTime" }>
>;

const PRICE_ENV_KEYS: Record<CheckoutPlan, Record<Currency, string>> = {
  annual: {
    usd: "STRIPE_PRICE_ANNUAL_USD",
    brl: "STRIPE_PRICE_ANNUAL_BRL",
  },
  kitCourse: {
    usd: "STRIPE_PRICE_KIT_COURSE_USD",
    brl: "STRIPE_PRICE_KIT_COURSE_BRL",
  },
};

const DEFAULT_PRICE_IDS: Record<CheckoutPlan, Record<Currency, string>> = {
  annual: {
    usd: "price_1TtC3JASZ821iIoqZ6cEpQnR",
    brl: "price_1TtC3IASZ821iIoqw4RTjQa3",
  },
  kitCourse: {
    usd: "price_1TtC3IASZ821iIoqhGAS6qJu",
    brl: "price_1TtC3IASZ821iIoqhO51z5Pq",
  },
};

const PLAN_METADATA: Record<CheckoutPlan, string> = {
  annual: "annual",
  kitCourse: "kit_course",
};

export const PLAN_UNIT_AMOUNT: Record<CheckoutPlan, Record<Currency, number>> = {
  annual: { usd: 12300, brl: 62300 },
  kitCourse: { usd: 18700, brl: 99700 },
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

const PLAN_CHECKOUT_COPY: Record<
  CheckoutPlan,
  Record<SiteLocale, { name: string; description: string }>
> = {
  annual: {
    pt: {
      name: "Kasy Kit Anual",
      description: "Kit completo Kasy: criar e atualizar apps pela CLI por 1 ano.",
    },
    en: {
      name: "Kasy Annual Kit",
      description: "Full Kasy kit: create and update apps with the CLI for 1 year.",
    },
    es: {
      name: "Kasy Kit Anual",
      description: "Kit completo de Kasy: crear y actualizar apps con la CLI por 1 año.",
    },
  },
  kitCourse: {
    pt: {
      name: "Kasy Kit + Club",
      description: "Kit completo (criar e atualizar por 1 ano) + Kasy Club por 1 ano.",
    },
    en: {
      name: "Kasy Kit + Club",
      description: "Full kit (create and update for 1 year) + Kasy Club for 1 year.",
    },
    es: {
      name: "Kasy Kit + Club",
      description: "Kit completo (crear y actualizar por 1 año) + Kasy Club por 1 año.",
    },
  },
};

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
  const copy = PLAN_CHECKOUT_COPY[plan][locale];

  return {
    quantity: 1,
    price_data: {
      currency,
      unit_amount: PLAN_UNIT_AMOUNT[plan][currency],
      product_data: {
        name: copy.name,
        description: copy.description,
        metadata: { plan: PLAN_METADATA[plan] },
      },
    },
  };
}

export function isBrazil(country: string | null | undefined): boolean {
  return country?.toUpperCase() === "BR";
}

export function currencyForCountry(country: string | null | undefined): Currency {
  return isBrazil(country) ? "brl" : "usd";
}

export function resolvePriceId(plan: CheckoutPlan, country: string | null | undefined): string {
  const currency = currencyForCountry(country);
  const envKey = PRICE_ENV_KEYS[plan][currency];
  return process.env[envKey] ?? DEFAULT_PRICE_IDS[plan][currency];
}

export function metadataPlan(plan: CheckoutPlan): string {
  return PLAN_METADATA[plan];
}

export function isCheckoutPlan(value: unknown): value is CheckoutPlan {
  return value === "annual" || value === "kitCourse";
}
