/** Cupom PPP / mercados emergentes (20%). */
export const REGIONAL_COUPON_CODE_PPP = "KASY20";

/** Cupom demais regiões (10%). */
export const REGIONAL_COUPON_CODE_STANDARD = "KASY10";

export const REGIONAL_DISCOUNT_PERCENT_PPP = 20;
export const REGIONAL_DISCOUNT_PERCENT_STANDARD = 10;

export type RegionalDiscount = {
  code: string;
  percent: number;
};

/**
 * Países PPP / acessibilidade (20%, KASY20).
 * América do Sul, América Central, Caribe, África e Ásia emergente.
 * Não inclui EUA, Canadá, Europa, Japão, Coreia, Singapura, etc.
 */
const REGIONAL_DISCOUNT_COUNTRIES_PPP = new Set([
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

/** true se o país entra no cupom PPP (KASY20). */
export function isRegionalDiscountEligible(
  country: string | null | undefined,
): boolean {
  return getRegionalDiscount(country) != null;
}

/**
 * Desconto regional pelo país do visitante.
 * PPP → KASY20 (20%). Demais países conhecidos → KASY10 (10%).
 */
export function getRegionalDiscount(
  country: string | null | undefined,
): RegionalDiscount | null {
  if (!country) return null;
  const code = country.toUpperCase();
  if (REGIONAL_DISCOUNT_COUNTRIES_PPP.has(code)) {
    return {
      code: REGIONAL_COUPON_CODE_PPP,
      percent: REGIONAL_DISCOUNT_PERCENT_PPP,
    };
  }
  return {
    code: REGIONAL_COUPON_CODE_STANDARD,
    percent: REGIONAL_DISCOUNT_PERCENT_STANDARD,
  };
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
