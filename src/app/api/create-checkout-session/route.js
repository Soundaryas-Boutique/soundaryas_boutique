import { NextResponse } from "next/server";
import Stripe from "stripe";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function POST(req) {
  const { items } = await req.json();

  if (!process.env.STRIPE_SECRET_KEY) {
    console.error("Stripe secret key is missing.");
    return NextResponse.json({ error: "Server configuration error." }, { status: 500 });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const totalAmount = items.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(totalAmount * 100), // in cents
      currency: "inr",
      metadata: {
        userId: session.user.id,
      },
      payment_method_types: ['card'],
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
      id: paymentIntent.id,
    }, { status: 200 });
  } catch (error) {
    console.error("Error creating payment intent:", error);
    return NextResponse.json(
      { error: "Error creating payment intent", details: error.message },
      { status: 500 }
    );
  }
}