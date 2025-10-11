import { NextResponse } from 'next/server';
import { connectDB } from '@/app/lib/mongoose';
import Cart from '@/app/(models)/Cart';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/lib/auth';
import Saree from '@/app/(models)/Saree'; // ✅ Import the Saree model

const getUserId = async () => {
    const session = await getServerSession(authOptions);
    if (!session || !session.user.id) {
        return { error: 'Unauthorized' };
    }
    return { userId: session.user.id };
};

// GET: Fetch the user's cart and populate images
export async function GET() {
  const { userId, error } = await getUserId();
  if (error) return NextResponse.json({ error }, { status: 401 });

  try {
    await connectDB();
    // ✅ FIX: Use populate to get the images from the Saree model
    let cart = await Cart.findOne({ userId }).populate('items.productId');

    if (!cart) {
      cart = new Cart({ userId, items: [] });
      await cart.save();
    }
    
    const populatedItems = cart.items.map(item => ({
      _id: item._id,
      productId: item.productId._id,
      productName: item.productName,
      price: item.price,
      selectedColor: item.selectedColor,
      quantity: item.quantity,
      images: item.productId.images // ✅ Get the images from the populated product
    }));
    
    const serializedCart = {
      _id: cart._id,
      userId: cart.userId,
      items: populatedItems,
      createdAt: cart.createdAt,
      updatedAt: cart.updatedAt
    };

    return NextResponse.json(JSON.parse(JSON.stringify(serializedCart)), { status: 200 });
  } catch (err) {
    console.error('Error fetching cart:', err);
    return NextResponse.json({ error: 'Failed to fetch cart' }, { status: 500 });
  }
}

// POST: Add or update an item in the cart
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
      existingItem.quantity += 1;
    } else {
      cart.items.push({ productId, productName, price, quantity: 1, selectedColor });
    }

    await cart.save();
    
    // ✅ FIX: Re-fetch and populate the cart to get the images back in the response
    const updatedCart = await Cart.findOne({ userId }).populate('items.productId');
    const serializedCart = {
      _id: updatedCart._id,
      userId: updatedCart.userId,
      items: updatedCart.items.map(item => ({
        _id: item._id,
        productId: item.productId._id,
        productName: item.productName,
        price: item.price,
        selectedColor: item.selectedColor,
        quantity: item.quantity,
        images: item.productId.images // ✅ Get the images from the populated product
      })),
      createdAt: updatedCart.createdAt,
      updatedAt: updatedCart.updatedAt
    };
    
    return NextResponse.json(JSON.parse(JSON.stringify(serializedCart)), { status: 200 });
  } catch (err) {
    console.error('Error updating cart:', err);
    return NextResponse.json({ error: 'Failed to update cart' }, { status: 500 });
  }
}