import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { getCart, getUserId } from '@/app/lib/cart';

// POST: Remove a single item from the cart
export async function POST(req) {
  const { userId, error } = await getUserId();
  if (error) return NextResponse.json({ error }, { status: 401 });

  try {
    const { productId } = await req.json();

    const { data: cart, error: cartError } = await supabase()
      .from('carts')
      .select('id')
      .eq('userId', userId)
      .maybeSingle();

    if (cartError) throw cartError;
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    const { error: deleteError } = await supabase()
      .from('cart_items')
      .delete()
      .eq('cartId', cart.id)
      .eq('productId', productId);

    if (deleteError) throw deleteError;

    return NextResponse.json(await getCart(userId), { status: 200 });
  } catch (err) {
    console.error('Error removing from cart:', err);
    return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 });
  }
}
