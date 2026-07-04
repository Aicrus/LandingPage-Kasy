export type CheckoutPlan = "annual" | "kitCourse";

type Currency = "usd" | "brl";

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
