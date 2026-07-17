/** Código de promoção Stripe para desconto regional (20%). */
export const REGIONAL_COUPON_CODE = "KASY20";

/** Percentual do cupom KASY20 no Stripe. */
export const REGIONAL_DISCOUNT_PERCENT = 20;

/**
 * Países onde mostramos o cupom regional (PPP / acessibilidade).
 * América do Sul, América Central, Caribe, África e Ásia emergente.
 * Não inclui EUA, Canadá, Europa, Japão, Coreia, Singapura, etc.
 */
const REGIONAL_DISCOUNT_COUNTRIES = new Set([
  // América do Sul
  "AR",
  "BO",
  "BR",
  "CL",
  "CO",
  "EC",
  "FK",
  "GF",
  "GY",
  "PY",
  "PE",
  "SR",
  "UY",
  "VE",
  // América Central + México
  "BZ",
  "CR",
  "SV",
  "GT",
  "HN",
  "MX",
  "NI",
  "PA",
  // Caribe
  "AG",
  "BS",
  "BB",
  "CU",
  "DM",
  "DO",
  "GD",
  "HT",
  "JM",
  "KN",
  "LC",
  "VC",
  "TT",
  // África
  "DZ",
  "AO",
  "BJ",
  "BW",
  "BF",
  "BI",
  "CV",
  "CM",
  "CF",
  "TD",
  "KM",
  "CG",
  "CD",
  "CI",
  "DJ",
  "EG",
  "GQ",
  "ER",
  "SZ",
  "ET",
  "GA",
  "GM",
  "GH",
  "GN",
  "GW",
  "KE",
  "LS",
  "LR",
  "LY",
  "MG",
  "MW",
  "ML",
  "MR",
  "MU",
  "MA",
  "MZ",
  "NA",
  "NE",
  "NG",
  "RW",
  "ST",
  "SN",
  "SC",
  "SL",
  "SO",
  "ZA",
  "SS",
  "SD",
  "TZ",
  "TG",
  "TN",
  "UG",
  "ZM",
  "ZW",
  // Ásia (PPP / mercados emergentes; sem JP, KR, SG, HK, TW, etc.)
  "AF",
  "BD",
  "BT",
  "KH",
  "IN",
  "ID",
  "LA",
  "LK",
  "MM",
  "MN",
  "NP",
  "PK",
  "PH",
  "TH",
  "VN",
]);

export function isRegionalDiscountEligible(
  country: string | null | undefined,
): boolean {
  if (!country) return false;
  return REGIONAL_DISCOUNT_COUNTRIES.has(country.toUpperCase());
}

/**
 * País do visitante via header Vercel.
 * Em localhost não há geo: usa DEV_IP_COUNTRY ou BR para revisar a LP.
 */
export function resolveViewerCountry(
  countryHeader: string | null | undefined,
): string | null {
  if (countryHeader) return countryHeader.toUpperCase();
  if (process.env.NODE_ENV === "development") {
    return (process.env.DEV_IP_COUNTRY ?? "BR").toUpperCase();
  }
  return null;
}
