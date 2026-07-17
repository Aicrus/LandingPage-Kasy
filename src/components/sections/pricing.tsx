import { headers } from "next/headers";
import { getLocale, getTranslations } from "next-intl/server";
import { Check } from "lucide-react";

import { CheckoutButton } from "@/components/checkout-button";
import { Reveal } from "@/components/motion/reveal";
import { PlanPrice } from "@/components/sections/plan-price";
import { RegionalDiscountNote } from "@/components/sections/regional-discount-banner";
import {
  currencyForCountry,
  PLAN_UNIT_AMOUNT,
  type CheckoutPlan,
  type Currency,
} from "@/lib/stripe/catalog";
import {
  isRegionalDiscountEligible,
  REGIONAL_DISCOUNT_PERCENT,
  resolveViewerCountry,
} from "@/lib/stripe/regional-discount";
import { cn } from "@/lib/utils";

type Plan = {
  key: CheckoutPlan;
  label: string;
  description: string;
  fullCents: number;
  discountedCents?: number;
  currency: Currency;
  per: string;
  tag?: string;
  featured?: boolean;
  cta: string;
  features: string[];
};

type PlanMeta = { key: CheckoutPlan; featured?: boolean };

const PLANS_META: PlanMeta[] = [
  { key: "annual" },
  { key: "kitCourse", featured: true },
];

type PlanCopy = Omit<
  Plan,
  "key" | "fullCents" | "discountedCents" | "currency" | "featured"
> & {
  clubLinkLabel?: string;
  clubLinkHref?: string;
};

const cardShadowClass = cn(
  "shadow-[0_1px_2px_rgba(4,43,89,0.04),0_6px_16px_-10px_rgba(4,43,89,0.12)]",
  "dark:shadow-[0_1px_2px_rgba(0,0,0,0.18),0_8px_20px_-10px_rgba(0,0,0,0.4)]",
);

const featuredShadowClass = cn(
  "shadow-[0_6px_16px_rgba(4,43,89,0.08),0_28px_60px_-20px_rgba(4,43,89,0.26)]",
  "dark:shadow-[0_6px_18px_rgba(0,0,0,0.32),0_32px_64px_-20px_rgba(0,0,0,0.55)]",
);

function PlanCard({
  plan,
  locale,
  clubLinkLabel,
  clubLinkHref,
}: {
  plan: Plan;
  locale: string;
  clubLinkLabel?: string;
  clubLinkHref?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex h-full flex-col rounded-2xl border p-7 transition-[border-color,box-shadow] duration-300 sm:p-8",
        plan.featured
          ? cn(
              "border-primary/50 bg-gradient-to-b from-primary/[0.05] via-card to-card hover:border-primary/70",
              featuredShadowClass,
            )
          : cn(
              "border-border/70 bg-card hover:border-primary/30 hover:shadow-lg",
              cardShadowClass,
            ),
      )}
    >
      {plan.tag ? (
        <span
          className={cn(
            "absolute -top-3.5 left-1/2 -translate-x-1/2 overflow-hidden rounded-full px-3.5 py-1 text-xs font-semibold whitespace-nowrap",
            plan.featured
              ? "bg-primary text-primary-foreground shadow-[0_4px_14px_-4px_rgba(0,0,0,0.35)]"
              : "border border-border/70 bg-background text-foreground shadow-[0_4px_14px_-4px_rgba(0,0,0,0.2)]",
          )}
        >
          <span className="relative z-10">{plan.tag}</span>
          {plan.featured ? (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -skew-x-[14deg] bg-gradient-to-r from-transparent via-white/70 to-transparent motion-safe:animate-[badge-shine_3.2s_ease-in-out_infinite]"
            />
          ) : null}
        </span>
      ) : null}

      <h3 className="font-heading text-[1.1875rem] font-semibold text-foreground">
        {plan.label}
      </h3>
      <p className="mt-2 text-[0.875rem] leading-snug text-muted-foreground">
        {plan.description}
      </p>

      <PlanPrice
        fullCents={plan.fullCents}
        discountedCents={plan.discountedCents}
        currency={plan.currency}
        per={plan.per}
        delay={plan.featured ? 3.4 : 2.8}
      />

      <CheckoutButton
        plan={plan.key}
        locale={locale}
        variant={plan.featured ? "default" : "outline"}
        className="mt-6 h-auto w-full justify-center rounded-full py-2.5 text-[0.9375rem]"
      >
        {plan.cta}
      </CheckoutButton>

      <div className="mt-7 border-t border-border/60 pt-6">
        <ul className="flex flex-col gap-3.5">
          {plan.features.map((feature) => (
            <li
              key={feature}
              className="flex items-start gap-2.5 text-[0.875rem] leading-snug text-foreground/85"
            >
              <Check
                className={cn(
                  "mt-0.5 size-4 shrink-0",
                  plan.featured ? "text-primary" : "text-muted-foreground",
                )}
                strokeWidth={2.5}
              />
              {feature}
            </li>
          ))}
        </ul>
        {clubLinkHref && clubLinkLabel ? (
          <a
            href={clubLinkHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex text-[0.8125rem] font-medium text-primary underline-offset-4 hover:underline"
          >
            {clubLinkLabel}
          </a>
        ) : null}
      </div>
    </div>
  );
}

export async function Pricing() {
  const t = await getTranslations("pricing");
  const locale = await getLocale();
  const country = resolveViewerCountry((await headers()).get("x-vercel-ip-country"));
  const currency = currencyForCountry(country);
  const showRegionalDiscount = isRegionalDiscountEligible(country);
  const plansCopy = t.raw("plans") as Record<string, PlanCopy>;

  const PLANS: Plan[] = PLANS_META.map((meta) => {
    const copy = plansCopy[meta.key];
    const fullCents = PLAN_UNIT_AMOUNT[meta.key][currency];
    return {
      ...meta,
      label: copy.label,
      description: copy.description,
      per: copy.per,
      tag: copy.tag,
      cta: copy.cta,
      features: copy.features,
      currency,
      fullCents,
      discountedCents: showRegionalDiscount
        ? Math.round(fullCents * (1 - REGIONAL_DISCOUNT_PERCENT / 100))
        : undefined,
    };
  });

  return (
    <section
      id="precos"
      className={cn(
        "mx-auto flex w-full flex-col items-center",
        "max-w-[min(96vw,76rem)]",
        "px-[clamp(0.75rem,2.5vw,2rem)] max-sm:px-[clamp(1rem,3.25vw,2rem)]",
        "mt-[var(--spacing-editor-to-features)] pb-[clamp(3rem,6vw,5rem)]",
        "scroll-mt-[calc(var(--header-height-mobile)+0.75rem)] sm:scroll-mt-24",
      )}
    >
      <Reveal
        className={cn(
          "flex w-full flex-col items-center text-center",
          "gap-[clamp(0.75rem,1vw+0.25rem,1.125rem)]",
          "mb-[clamp(2.5rem,4.5vw,3.5rem)] px-[clamp(1.25rem,4vw,3.5rem)]",
        )}
      >
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {t("eyebrow")}
        </span>
        <h2
          className={cn(
            "text-balance font-heading font-bold text-foreground",
            "text-[clamp(1.625rem,1.15rem+1.6vw,2.5rem)]",
            "leading-[1.12] tracking-[-0.02em]",
          )}
        >
          {t("heading")}
        </h2>
        <p className="max-w-fluid-subtitle text-pretty font-rounded text-fluid-subtitle text-muted-foreground">
          {t("subtitle")}
        </p>
      </Reveal>

      <Reveal
        delay={0.1}
        className="grid w-full max-w-[44rem] grid-cols-1 items-stretch gap-6 sm:grid-cols-2"
      >
        {PLANS.map((plan) => {
          const copy = plansCopy[plan.key];
          return (
            <PlanCard
              key={plan.key}
              locale={locale}
              plan={plan}
              clubLinkLabel={copy.clubLinkLabel}
              clubLinkHref={copy.clubLinkHref}
            />
          );
        })}
      </Reveal>

      {showRegionalDiscount ? <RegionalDiscountNote /> : null}

      <p
        className={cn(
          "max-w-md text-center text-[0.8125rem] text-muted-foreground",
          showRegionalDiscount ? "mt-3" : "mt-8",
        )}
      >
        {t("checkoutNote")}
      </p>
    </section>
  );
}
