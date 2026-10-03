import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { getCart, getUserId, normaliseColor } from '@/app/lib/cart';

// POST: Update the quantity of a specific item (or remove it if quantity <= 0)
export async function POST(req) {
  const { userId, error } = await getUserId();
  if (error) return NextResponse.json({ error }, { status: 401 });

  try {
    const { productId, selectedColor, newQuantity } = await req.json();
    const colour = normaliseColor(selectedColor);

    const { data: cart, error: cartError } = await supabase()
      .from('carts')
      .select('id')
      .eq('userId', userId)
      .maybeSingle();

    if (cartError) throw cartError;
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    const match = supabase()
      .from('cart_items')
      .select('id')
      .eq('cartId', cart.id)
      .eq('productId', productId)
      .eq('selectedColor', colour);

    const { data: item, error: itemError } = await match.maybeSingle();
    if (itemError) throw itemError;

    if (item) {
      // quantity has a `>= 1` check constraint, so dropping to zero is a delete.
      const { error: writeError } =
        newQuantity <= 0
          ? await supabase().from('cart_items').delete().eq('id', item.id)
          : await supabase()
              .from('cart_items')
              .update({ quantity: newQuantity })
              .eq('id', item.id);

      if (writeError) throw writeError;
    }

    return NextResponse.json(await getCart(userId), { status: 200 });
  } catch (err) {
    console.error('Error updating cart quantity:', err);
    return NextResponse.json({ error: 'Failed to update cart quantity' }, { status: 500 });
  }
}
