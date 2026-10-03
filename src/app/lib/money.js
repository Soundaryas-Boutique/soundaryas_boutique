// Single source of truth for money formatting.
//
// Prices were previously rendered five different ways -- toLocaleString with
// en-IN and 2dp, a bare toLocaleString, toFixed(2), and raw numbers -- so the
// same ₹1500 appeared as "₹1,500.00", "₹1,500", "₹1500.00" and "₹1500"
// depending on the file. The bare toLocaleString() was worse than
// inconsistent: it follows the *visitor's* browser locale, so a shopper
// abroad saw different grouping from one in India.
//
// en-IN also groups by lakh (₹1,25,000.00), which toFixed cannot do at all.

export const LOCALE = "en-IN";
export const CURRENCY = "INR";

// Stripe wants the lowercase ISO code. Kept here so the currency is declared
// in one place; /api/create-checkout-session still has its own literal.
export const STRIPE_CURRENCY = "inr";

// Built once, not per call -- constructing Intl.NumberFormat is comparatively
// expensive and these run inside render.
const priceFormatter = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: CURRENCY,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

/**
 * Format an amount as a currency string, e.g. 1500 -> "₹1,500.00".
 *
 * Returns an em dash for anything that is not a finite number, so a missing
 * price shows as "—" instead of throwing the way `price.toFixed(2)` did.
 *
 * @param {number|string|null|undefined} value
 * @returns {string}
 */
export function formatPrice(value) {
  const amount = typeof value === "string" ? Number(value) : value;
  if (typeof amount !== "number" || !Number.isFinite(amount)) return "—";
  return priceFormatter.format(amount);
}
