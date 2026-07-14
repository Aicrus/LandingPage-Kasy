import { getSiteUrl } from "@/lib/stripe/server";

/** Mirrors light-theme tokens from `src/app/globals.css`. */
export const CHECKOUT_BRANDING = {
  display_name: "Kasy",
  font_family: "inter" as const,
  border_style: "pill" as const,
  background_color: "#f2f6fc",
  button_color: "#0553b1",
};

export function checkoutBrandingSettings() {
  const siteUrl = getSiteUrl();

  return {
    ...CHECKOUT_BRANDING,
    // Tight-crop wordmark so Stripe renders the logo larger in Checkout.
    logo: {
      type: "url" as const,
      url: `${siteUrl}/stripe-checkout-logo.png`,
    },
  };
}
