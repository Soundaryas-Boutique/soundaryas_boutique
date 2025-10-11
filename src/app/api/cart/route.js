import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongoose2';
import Cart from '@/app/(models)/Cart';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';

// Helper to get userId and check auth
const getUserId = async () => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
        return { error: 'Unauthorized' };
    }
    return { userId: session.user.id };
};

// GET: Fetch the user's cart
export async function GET() {
  const { userId, error } = await getUserId();
  if (error) return NextResponse.json({ error }, { status: 401 });

  try {
    await connectDB();
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }
    
    // Serialize data to plain object before returning
    const serializedCart = JSON.parse(JSON.stringify(cart));
    return NextResponse.json(serializedCart, { status: 200 });
  } catch (err) {
    console.error('Error fetching cart:', err);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

// POST: Add or update an item in the cart (quantity +1)
export async function POST(req) {
  const { userId, error } = await getUserId();
  if (error) return NextResponse.json({ error }, { status: 401 });

  try {
    await connectDB();
    const { productId, productName, price, quantity, selectedColor } = await req.json();

    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    const existingItem = cart.items.find(
      item => item.productId.toString() === productId && item.selectedColor === selectedColor
    );

    if (existingItem) {
      existingItem.quantity += 1; // Always increment by 1 for "Add to Cart" button
    } else {
      cart.items.push({ productId, productName, price, quantity: 1, selectedColor });
    }

    await cart.save();
    const serializedCart = JSON.parse(JSON.stringify(cart));

    return NextResponse.json(serializedCart, { status: 200 });
  } catch (err) {
    console.error('Error updating cart:', err);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}