export type CheckoutPlan = "annual" | "kitCourse";

type Currency = "usd" | "brl";
export type SiteLocale = "pt" | "en" | "es";

export const PLAN_DISPLAY = {
  annual: {
    usd: { amount: "$127", perKey: "perYear" as const },
    brl: { amount: "R$657", perKey: "perYear" as const },
  },
  kitCourse: {
    usd: { amount: "$193", perKey: "oneTime" as const },
    brl: { amount: "R$998", perKey: "oneTime" as const },
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
    usd: "price_1TpNltASZ821iIoqppYS3paq",
    brl: "price_1TpNluASZ821iIoqSvG9cJdL",
  },
  kitCourse: {
    usd: "price_1TpNluASZ821iIoqm0XHrt5E",
    brl: "price_1TpNlvASZ821iIoqjmIzDds4",
  },
};

const PLAN_METADATA: Record<CheckoutPlan, string> = {
  annual: "annual",
  kitCourse: "kit_course",
};

const PLAN_UNIT_AMOUNT: Record<CheckoutPlan, Record<Currency, number>> = {
  annual: { usd: 12700, brl: 65700 },
  kitCourse: { usd: 19300, brl: 99800 },
};

const PLAN_CHECKOUT_COPY: Record<
  CheckoutPlan,
  Record<SiteLocale, { name: string; description: string }>
> = {
  annual: {
    pt: {
      name: "Kasy — Plano Anual",
      description: "Kit completo Kasy com atualizações por 1 ano.",
    },
    en: {
      name: "Kasy — Annual Plan",
      description: "Full Kasy kit with updates for 1 year.",
    },
    es: {
      name: "Kasy — Plan Anual",
      description: "Kit completo de Kasy con actualizaciones por 1 año.",
    },
  },
  kitCourse: {
    pt: {
      name: "Kasy — Kit + Curso",
      description: "Kit completo + curso prático por 1 ano.",
    },
    en: {
      name: "Kasy — Kit + Course",
      description: "Full kit + hands-on course access for 1 year.",
    },
    es: {
      name: "Kasy — Kit + Curso",
      description: "Kit completo + curso práctico por 1 año.",
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
