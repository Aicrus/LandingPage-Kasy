import { getSiteUrl } from "@/lib/stripe/server";

/** Mirrors light-theme tokens from `src/app/globals.css`. */
export const CHECKOUT_BRANDING = {
  display_name: "Kasy",
  font_family: "inter" as const,
  border_style: "pill" as const,
  background_color: "#f3f7f6",
  button_color: "#0f766e",
};

export function checkoutBrandingSettings() {
  const siteUrl = getSiteUrl();

  return {
    ...CHECKOUT_BRANDING,
    logo: {
      type: "url" as const,
      url: `${siteUrl}/icon.png`,
    },
  };
}
