"use client";

import Script from "next/script";

import {
  GA_MEASUREMENT_ID,
  GOOGLE_ADS_ID,
  googleTagSrcId,
  isGoogleEnabled,
} from "@/lib/analytics/google";

/** gtag.js servindo GA4 e Google Ads na mesma carga. */
export function GoogleTagScript() {
  if (!isGoogleEnabled()) return null;

  const configs = [
    GA_MEASUREMENT_ID ? `gtag('config', '${GA_MEASUREMENT_ID}');` : "",
    GOOGLE_ADS_ID ? `gtag('config', '${GOOGLE_ADS_ID}');` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <>
      <Script
        id="google-tag-src"
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${googleTagSrcId()}`}
      />
      <Script id="google-tag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;
gtag('js', new Date());
${configs}`}
      </Script>
    </>
  );
}
