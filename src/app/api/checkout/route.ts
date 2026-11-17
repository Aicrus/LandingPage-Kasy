import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { routing } from "@/i18n/routing";
import {
  isCheckoutPlan,
  isSiteLocale,
  metadataPlan,
  isSubscriptionPlan,
  renewalSubmitMessage,
  resolveCheckoutLineItems,
  stripeLocale,
} from "@/lib/stripe/catalog";
import { resolveViewerCountry } from "@/lib/stripe/regional-discount";
import { checkoutBrandingSettings } from "@/lib/stripe/branding";
import { getSiteUrl, getStripe } from "@/lib/stripe/server";

type CheckoutBody = {
  plan?: unknown;
  locale?: unknown;
};

export async function POST(request: Request) {
  let body: CheckoutBody;

  try {
    body = (await request.json()) as CheckoutBody;
  } catch {
    return NextResponse.json({ error: "invalid_body" }, { status: 400 });
  }

  if (!isCheckoutPlan(body.plan)) {
    return NextResponse.json({ error: "invalid_plan" }, { status: 400 });
  }

  const locale =
    typeof body.locale === "string" && routing.locales.includes(body.locale as (typeof routing.locales)[number])
      ? body.locale
      : routing.defaultLocale;
  const siteLocale = isSiteLocale(locale) ? locale : "en";

  const country = resolveViewerCountry((await headers()).get("x-vercel-ip-country"));
  const siteUrl = getSiteUrl();

  try {
    const stripe = getStripe();
    const metadata = {
      // source distinguishes Kit LP vs Club LP when both share one Stripe account/webhook.
      source: "kit_lp",
      plan: metadataPlan(body.plan),
      // Only kit plans are sold on this LP now (Club is a separate product/site).
      products: "kit",
      locale: siteLocale,
    };
    const subscription = isSubscriptionPlan(body.plan);

    const session = await stripe.checkout.sessions.create({
      // Founder = assinatura anual (renova no cartão); Solo = pagamento único.
      mode: subscription ? "subscription" : "payment",
      locale: stripeLocale(siteLocale),
      branding_settings: checkoutBrandingSettings(),
      line_items: resolveCheckoutLineItems(body.plan, country, siteLocale),
      allow_promotion_codes: true,
      // Em modo assinatura o cliente já é sempre criado (o parâmetro é recusado).
      ...(subscription
        ? {
            subscription_data: { metadata },
            custom_text: {
              submit: { message: renewalSubmitMessage(country, siteLocale) },
            },
          }
        : { customer_creation: "always" as const }),
      metadata,
      success_url: `${siteUrl}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}&plan=${body.plan}`,
      cancel_url: `${siteUrl}/${locale}/#precos`,
    });

    if (!session.url) {
      return NextResponse.json({ error: "missing_checkout_url" }, { status: 500 });
    }

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("[checkout]", error);
    return NextResponse.json({ error: "checkout_failed" }, { status: 500 });
  }
}
