import { NextResponse } from 'next/server';
import { supabase } from '@/app/lib/supabase';
import { ensureCart, getCart, getUserId } from '@/app/lib/cart';

// GET: Fetch the user's cart with each item's product images
export async function GET() {
  const { userId, error } = await getUserId();
  if (error) return NextResponse.json({ error }, { status: 401 });

  try {
    return NextResponse.json(await getCart(userId), { status: 200 });
  } catch (err) {
    console.error('Error fetching cart:', err);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

// POST: Add an item to the cart, or bump its quantity if already there
export async function POST(req) {
  const { userId, error } = await getUserId();
  if (error) return NextResponse.json({ error }, { status: 401 });

  try {
    const { productId, productName, price } = await req.json();
    const cartId = await ensureCart(userId);
    const db = supabase();

    const { data: existing, error: selectError } = await db
      .from('cart_items')
      .select('id, quantity')
      .eq('cartId', cartId)
      .eq('productId', productId)
      .maybeSingle();

    if (selectError) throw selectError;

    if (existing) {
      const { error: updateError } = await db
        .from('cart_items')
        .update({ quantity: existing.quantity + 1 })
        .eq('id', existing.id);

      if (updateError) throw updateError;
    } else {
      const { error: insertError } = await db.from('cart_items').insert({
        cartId,
        productId,
        productName,
        price,
        quantity: 1,
      });

      if (insertError) throw insertError;
    }

    return NextResponse.json(await getCart(userId), { status: 200 });
  } catch (err) {
    console.error('Error adding to cart:', err);
    return NextResponse.json({ error: 'Failed to add to cart' }, { status: 500 });
  }
}
