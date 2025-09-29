import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const { items } = await req.json();

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const lineItems = items.map((item) => {
      const images = (item.images && Array.isArray(item.images))
        ? item.images.map((img) => img.url)
        : [];

      const price = item.discountPrice || item.price;
      if (typeof price !== 'number' || isNaN(price) || price <= 0) {
        throw new Error(`Invalid price for product: ${item.productName}`);
      }

      return {
        price_data: {
          currency: "inr",
          product_data: {
            name: item.productName,
            images: images,
          },
          unit_amount: Math.round(price * 100),
        },
        quantity: item.quantity,
      };
    });

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/success`,
      cancel_url: `${process.env.NEXTAUTH_URL}/Cart`,
      customer_email: session.user.email,
    });

    return NextResponse.json({ id: checkoutSession.id, url: checkoutSession.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Error creating checkout session", details: error.message },
      { status: 500 }
    );
  }
}