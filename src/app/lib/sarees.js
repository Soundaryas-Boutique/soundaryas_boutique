import { supabase } from "./supabase";

// Supabase returns plain JSON (ISO date strings, numbers), so unlike the
// Mongoose version these rows can be handed to Client Components as they are.

const CARD_FIELDS =
  "id, productName, price, discountPrice, images, slug, category, createdAt, updatedAt";

/**
 * Fetch top best sellers
 */
export async function getBestSellers(limit = 5) {
  const { data, error } = await supabase()
    .from("sarees")
    .select(CARD_FIELDS)
    .eq("status", "active")
    .order("sold", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Fetch latest sarees (new arrivals)
 */
export async function getNewArrivals(limit = 5) {
  const { data, error } = await supabase()
    .from("sarees")
    .select(CARD_FIELDS)
    .eq("status", "active")
    .order("createdAt", { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data;
}

/**
 * Fetch both best sellers and new arrivals in parallel
 */
export async function getHomepageSarees(limit = 5) {
  const [bestSellers, newArrivals] = await Promise.all([
    getBestSellers(limit),
    getNewArrivals(limit),
  ]);

  return { bestSellers, newArrivals };
}

/**
 * Fetch related sarees by category, excluding current saree
 */
export async function getRelatedSarees(category, currentSlug, limit = 5) {
  const { data, error } = await supabase()
    .from("sarees")
    .select(CARD_FIELDS)
    .eq("category", category)
    .eq("status", "active")
    .neq("slug", currentSlug)
    .limit(limit);

  if (error) throw error;
  return data;
}
