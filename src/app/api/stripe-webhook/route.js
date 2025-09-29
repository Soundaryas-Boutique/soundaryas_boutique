import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/app/lib/mongoose2";
import Order from "@/app/(models)/Order";
import User from "@/app/(models)/User";
import { headers } from "next/headers";
import mongoose from "mongoose";

// Ensure your Stripe Secret Key is set in .env.local
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET // 👈 Your webhook secret must be set
    );
  } catch (err) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    return NextResponse.json({ message: "Webhook Error" }, { status: 400 });
  }

  // Handle the checkout.session.completed event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    console.log("Checkout Session Completed:", session);

    try {
      await connectDB();
      
      // 1. Find the user based on the email provided to Stripe Checkout
      const user = await User.findOne({ email: session.customer_email });
      if (!user) {
        console.error("User not found for this email:", session.customer_email);
        return NextResponse.json({ received: true }); // Still return 200 to Stripe
      }

      // 2. Fetch line items from the session
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        limit: 100,
      });

      // 3. Map line items to your Order model format
      const products = lineItems.data.map((item) => ({
        // Note: For a complete solution, you must pass productId in the checkout metadata. 
        // For simplicity, we create a temporary ObjectId and rely on productName here.
        productId: new mongoose.Types.ObjectId(), 
        productName: item.description,
        quantity: item.quantity,
        price: item.price.unit_amount / 100, // Convert from cents to rupees
      }));

      // 4. Create the new order document
      const order = new Order({
        userId: user._id,
        products: products,
        totalAmount: session.amount_total / 100,
        stripeSessionId: session.id,
        paymentStatus: "paid",
        orderStatus: "processing",
        shippingDetails: {
          name: session.shipping_details?.name,
          address: session.shipping_details?.address?.line1,
          city: session.shipping_details?.address?.city,
          pincode: session.shipping_details?.address?.postal_code,
        },
      });

      await order.save();
      console.log("Order saved successfully:", order);
    } catch (dbError) {
      console.error("Database error in webhook handler:", dbError);
      return NextResponse.json({ message: "Database Error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}