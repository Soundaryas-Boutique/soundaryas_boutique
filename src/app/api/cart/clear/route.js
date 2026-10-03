import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { getUserId } from '@/app/lib/cart';

// POST: Empty the user's cart. Called from /success once Stripe redirects back.
export async function POST() {
  const { userId, error } = await getUserId();
  if (error) return NextResponse.json({ error }, { status: 401 });

  try {
    const { data: cart, error: cartError } = await supabase()
      .from('carts')
      .select('id')
      .eq('userId', userId)
      .maybeSingle();

    if (cartError) throw cartError;

    // No cart row yet means there is nothing to clear, which is a success.
    if (!cart) {
      return NextResponse.json({ success: true, items: [] }, { status: 200 });
    }

    // The cart row itself is kept so the user keeps a stable cart id.
    const { error: deleteError } = await supabase()
      .from('cart_items')
      .delete()
      .eq('cartId', cart.id);

    if (deleteError) throw deleteError;

    return NextResponse.json({ success: true, items: [] }, { status: 200 });
  } catch (err) {
    console.error('Error clearing cart:', err);
    return NextResponse.json({ error: 'Failed to clear cart' }, { status: 500 });
  }
}
