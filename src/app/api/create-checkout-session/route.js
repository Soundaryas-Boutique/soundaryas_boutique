import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { options } from "@/app/api/auth/[...nextauth]/route";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const { items } = await req.json();

  const session = await getServerSession(options);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const lineItems = items.map((item) => ({
      price_data: {
        currency: "inr", // Use 'inr' for Indian Rupees
        product_data: {
          name: item.productName,
          images: item.images.map((img) => img.url),
        },
        unit_amount: Math.round((item.discountPrice || item.price) * 100),
      },
      quantity: item.quantity,
    }));

    const checkoutSession = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: lineItems,
      mode: "payment",
      success_url: `${process.env.NEXTAUTH_URL}/success`, // Redirect on successful payment
      cancel_url: `${process.env.NEXTAUTH_URL}/Cart`, // Redirect on cancellation
      customer_email: session.user.email,
    });

    return NextResponse.json({ id: checkoutSession.id, url: checkoutSession.url });
  } catch (error) {
    console.error("Error creating checkout session:", error);
    return NextResponse.json(
      { error: "Error creating checkout session" },
      { status: 500 }
    );
  }
}