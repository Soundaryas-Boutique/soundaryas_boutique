import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongoose';
import Cart from '@/app/(models)/Cart';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

const getUserId = async () => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
        return { error: 'Unauthorized' };
    }
    return { userId: session.user.id };
};

// POST: Remove a single item from the cart
export async function POST(req) {
  const { userId, error } = await getUserId();
  if (error) return NextResponse.json({ error }, { status: 401 });

  try {
    await connectDB();
    const { productId, selectedColor } = await req.json();

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    cart.items = cart.items.filter(
      item => !(item.productId.toString() === productId && item.selectedColor === selectedColor)
    );

    await cart.save();

    // Re-fetch and populate the cart to get the latest data
    const updatedCart = await Cart.findOne({ userId }).populate('items.productId');
    return NextResponse.json(JSON.parse(JSON.stringify(updatedCart)), { status: 200 });
  } catch (err) {
    console.error('Error removing from cart:', err);
    return NextResponse.json({ error: 'Failed to remove from cart' }, { status: 500 });
  }
}