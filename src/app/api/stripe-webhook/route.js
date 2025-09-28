import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/app/lib/mongoose2";
import Order from "@/app/(models)/Order";
import User from "@/app/(models)/User";
import { headers } from "next/headers";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
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
      
      const user = await User.findOne({ email: session.customer_email });
      if (!user) {
        console.error("User not found for this email:", session.customer_email);
        return NextResponse.json({ received: true });
      }

      // Fetch line items from the session
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        limit: 100,
      });

      // Map line items to your Order model format
      const products = lineItems.data.map((item) => ({
        // Note: Stripe line items don't store your product's internal ID
        // You would need to store the `productId` in the metadata of the
        // checkout session to get it back here. For now, we'll use the description.
        // For a full solution, you would pass `productId` in the checkout session's metadata.
        // This is a simplified approach.
        productName: item.description,
        quantity: item.quantity,
        price: item.price.unit_amount / 100, // Convert from cents to dollars/rupees
      }));

      // Create a new order in your database
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