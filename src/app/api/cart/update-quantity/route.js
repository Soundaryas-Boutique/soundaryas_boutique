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

// POST: Update the quantity of a specific item (or remove it if quantity <= 0)
export async function POST(req) {
  const { userId, error } = await getUserId();
  if (error) return NextResponse.json({ error }, { status: 401 });

  try {
    await connectDB();
    const { productId, selectedColor, newQuantity } = await req.json();

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return NextResponse.json({ error: 'Cart not found' }, { status: 404 });
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId.toString() === productId && item.selectedColor === selectedColor
    );

    if (itemIndex > -1) {
      if (newQuantity <= 0) {
        // Remove item if new quantity is 0 or less
        cart.items.splice(itemIndex, 1);
      } else {
        // Update quantity
        cart.items[itemIndex].quantity = newQuantity;
      }
    }

    await cart.save();
    const serializedCart = JSON.parse(JSON.stringify(cart));

    return NextResponse.json(serializedCart, { status: 200 });
  } catch (err) {
    console.error('Error updating cart quantity:', err);
    return NextResponse.json({ error: 'Failed to update cart quantity' }, { status: 500 });
  }
}