import createMiddleware from "next-intl/middleware";
import type { NextRequest } from "next/server";

import { routing } from "@/i18n/routing";

/**
 * País (header `x-vercel-ip-country`, presente em toda request na Vercel) → locale.
 * Qualquer país fora do mapa cai no `defaultLocale` ("en").
 */
const COUNTRY_TO_LOCALE: Record<string, string> = {
  // Português — Brasil e Portugal
  BR: "pt",
  PT: "pt",

  // Espanhol — América hispânica + Espanha
  AR: "es",
  BO: "es",
  CL: "es",
  CO: "es",
  CR: "es",
  CU: "es",
  DO: "es",
  EC: "es",
  SV: "es",
  GT: "es",
  HN: "es",
  MX: "es",
  NI: "es",
  PA: "es",
  PY: "es",
  PE: "es",
  PR: "es",
  UY: "es",
  VE: "es",
  ES: "es",
};

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const country = request.headers.get("x-vercel-ip-country");

  if (!request.cookies.has("NEXT_LOCALE") && country) {
    const guessedLocale = COUNTRY_TO_LOCALE[country] ?? routing.defaultLocale;
    request.cookies.set("NEXT_LOCALE", guessedLocale);
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|_vercel|.*\\..*).*)"],
};
