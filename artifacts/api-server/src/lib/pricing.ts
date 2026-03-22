/**
 * DialGlobal retail number pricing (USD/month)
 *
 * Strategy: 2.5–3× markup over Telnyx wholesale rates.
 * Competitors benchmark:
 *   Hushed   $3.99–7.99/mo · Burner $4.99/mo · 2ndline $2.99/mo
 *   Sideline $9.99/mo · TextNow $2.99/mo · Flyp $3.99/mo
 *
 * We sit slightly below Hushed/Burner for NA/EU core markets,
 * and price emerging markets at parity with the market rate
 * since competitors rarely cover them.
 */

export const RETAIL_PRICES: Record<string, number> = {
  // North America
  US: 2.99,  CA: 2.99,  PR: 2.49,  MX: 4.49,

  // UK & Ireland
  GB: 3.99,  IE: 5.49,

  // Western Europe – core
  DE: 6.49,  FR: 6.49,  NL: 6.49,  BE: 6.49,
  IT: 5.49,  ES: 5.49,  PT: 5.49,
  AT: 6.49,  CH: 7.49,  LU: 7.49,

  // Nordics
  DK: 5.49,  NO: 6.49,  SE: 5.49,  FI: 5.49,  IS: 6.99,

  // Southern Europe
  GR: 5.99,  MT: 5.99,  CY: 5.99,

  // Central & Eastern Europe
  PL: 4.49,  CZ: 5.49,  SK: 5.49,  HU: 5.49,
  RO: 5.49,  BG: 5.49,  HR: 5.99,  SI: 5.99,
  RS: 6.49,  BA: 7.99,  ME: 7.99,  MK: 7.99,  AL: 7.99,
  LT: 4.49,  LV: 4.49,  EE: 4.49,
  MD: 7.99,  UA: 6.49,  GE: 7.99,  AM: 7.99,  AZ: 7.99,

  // Oceania
  AU: 6.49,  NZ: 6.49,

  // Asia Pacific
  SG: 8.49,  HK: 8.49,  JP: 11.99, KR: 8.99,
  TW: 8.99,  MY: 7.99,  PH: 7.99,  IN: 8.99,  TH: 7.99,

  // Latin America
  BR: 5.99,  AR: 5.99,  CL: 5.99,  CO: 5.99,
  PE: 6.49,  UY: 6.49,  EC: 6.49,  DO: 5.49,
  CR: 6.49,  PA: 7.99,  GT: 7.99,  TT: 6.49,

  // Middle East
  IL: 7.99,  AE: 8.49,  SA: 9.99,  JO: 9.49,  KW: 9.49,

  // Africa
  ZA: 6.49,  NG: 7.99,  KE: 7.99,  EG: 7.99,
  MA: 7.99,  GH: 7.99,  TZ: 7.99,
};

const DEFAULT_PRICE = 7.99;

/** Returns our retail price string (2 decimals) for a given country code. */
export function getRetailPrice(countryCode: string): string {
  const price = RETAIL_PRICES[countryCode.toUpperCase()];
  return (price ?? DEFAULT_PRICE).toFixed(2);
}
