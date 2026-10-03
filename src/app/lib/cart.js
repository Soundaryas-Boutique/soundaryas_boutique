import { supabase } from "./supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

// The cart used to be one document with an embedded items array, so every route
// re-implemented "find the cart, then find the item inside it". With carts and
// cart_items as separate tables that bookkeeping lives here once.

export async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user.id) {
    return { error: "Unauthorized" };
  }
  return { userId: session.user.id };
}

/** selectedColor is `not null default ''`, so the unique index can rely on it. */
export function normaliseColor(selectedColor) {
  return selectedColor ?? "";
}

/** Returns the user's cart id, creating the cart row on first use. */
export async function ensureCart(userId) {
  const db = supabase();

  const { data: existing, error: selectError } = await db
    .from("carts")
    .select("id")
    .eq("userId", userId)
    .maybeSingle();

  if (selectError) throw selectError;
  if (existing) return existing.id;

  const { data: created, error: insertError } = await db
    .from("carts")
    .insert({ userId })
    .select("id")
    .single();

  if (insertError) throw insertError;
  return created.id;
}

/**
 * The cart in the shape the client already expects: `items`, each carrying the
 * product's `images`. Replaces `.populate('items.productId')`.
 */
export async function getCart(userId) {
  const cartId = await ensureCart(userId);

  const { data: cart, error } = await supabase()
    .from("carts")
    .select(
      "id, userId, createdAt, updatedAt, items:cart_items(id, productId, productName, price, selectedColor, quantity, sarees(images))"
    )
    .eq("id", cartId)
    .single();

  if (error) throw error;

  return {
    ...cart,
    items: cart.items.map(({ sarees, ...item }) => ({
      ...item,
      images: sarees?.images ?? [],
    })),
  };
}
