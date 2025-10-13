import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/app/lib/mongoose";
import Order from "@/app/(models)/Order";
import User from "@/app/(models)/User";
import { headers } from "next/headers";
import mongoose from "mongoose";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  console.log("1. Webhook POST request received.");

  try {
    const body = await req.text();
    const signature = await headers().get("Stripe-Signature");
    let event;

    try {
      console.log("2. Attempting to construct event...");
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error(`🛑 Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ message: "Webhook Error" }, { status: 400 });
    }

    console.log("3. Event constructed successfully.");

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      console.log("4. Event type is checkout.session.completed. Session ID:", session.id);

      try {
        await connectDB();
        console.log("5. Database connected.");

        const user = await User.findOne({ email: session.customer_email });
        console.log("6. User search complete. User found:", user ? "Yes" : "No");

        if (!user) {
          console.error("🛑 Error: User not found for email:", session.customer_email);
          return NextResponse.json({ received: true });
        }

        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });
        console.log("7. Line items fetched from Stripe.");

        const products = lineItems.data.map((item) => {
          return {
            productId: new mongoose.Types.ObjectId(), 
            productName: item.description,
            quantity: item.quantity,
            price: item.price.unit_amount / 100,
          };
        });
        console.log("8. Products array created:", products);
        
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
        console.log("9. Order object created.");

        await order.save();
        console.log("10. Order saved successfully! DB entry:", order);

      } catch (dbError) {
        console.error("🛑 Database error in webhook handler:", dbError);
        return NextResponse.json({ message: "Database Error" }, { status: 500 });
      }
    }
    console.log("11. Webhook handler finished.");
    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("🛑 An unexpected error occurred in the webhook handler:", error);
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}