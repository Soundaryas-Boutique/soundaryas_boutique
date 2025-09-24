import { NextResponse } from "next/server";
import Stripe from "stripe";
import { connectDB } from "@/app/lib/mongoose2";
import Order from "@/app/(models)/Order";
import Saree from "@/app/(models)/Saree";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function POST(req) {
  const rawBody = await req.text();
  const signature = req.headers.get("stripe-signature");

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
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
      // Retrieve the user from your database using the email or customer ID
      const user = await User.findOne({ email: session.customer_email });
      if (!user) {
        console.error("User not found for this email:", session.customer_email);
        return NextResponse.json({ received: true });
      }

      // Retrieve the session with line items
      const lineItems = await stripe.checkout.sessions.listLineItems(session.id, {
        limit: 100,
      });

      // Map line items to your Order model format
      const products = lineItems.data.map((item) => ({
        // You'll need to fetch the original product ID from your database
        // based on the product name or another identifier.
        // For simplicity, we'll use a placeholder here.
        productId: new mongoose.Types.ObjectId(), // You should map this to your Saree._id
        productName: item.description,
        quantity: item.quantity,
        price: item.price.unit_amount / 100,
      }));

      // Create a new order in your database
      const order = new Order({
        userId: user._id,
        products: products,
        totalAmount: session.amount_total / 100,
        stripeSessionId: session.id,
        paymentStatus: "paid",
        orderStatus: "processing",
        // You can also get shipping details from the session
        shippingDetails: {
          name: session.shipping_details?.name,
          address: session.shipping_details?.address?.line1,
          city: session.shipping_details?.address?.city,
          pincode: session.shipping_details?.address?.postal_code,
        },
      });

      await order.save();
      console.log("Order saved successfully:", order);
      
      // OPTIONAL: Clear the user's cart in your database if you have one
      // If you're using localStorage, you would handle this on the client side after redirection.

    } catch (dbError) {
      console.error("Database error in webhook handler:", dbError);
      return NextResponse.json({ message: "Database Error" }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}