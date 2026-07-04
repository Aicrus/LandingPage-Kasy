import { headers } from "next/headers";
import { NextResponse } from "next/server";

import { routing } from "@/i18n/routing";
import {
  isCheckoutPlan,
  metadataPlan,
  resolvePriceId,
} from "@/lib/stripe/catalog";
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

  const country = (await headers()).get("x-vercel-ip-country");
  const priceId = resolvePriceId(body.plan, country);
  const siteUrl = getSiteUrl();

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [{ price: priceId, quantity: 1 }],
      allow_promotion_codes: true,
      customer_creation: "always",
      metadata: {
        plan: metadataPlan(body.plan),
        locale,
      },
      success_url: `${siteUrl}/${locale}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
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
