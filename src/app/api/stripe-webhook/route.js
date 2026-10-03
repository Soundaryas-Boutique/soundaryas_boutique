import { NextResponse } from "next/server";
import Stripe from "stripe";
import { supabase } from "@/app/lib/supabase";
import { headers } from "next/headers";

export async function POST(req) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  try {
    const body = await req.text();
    const signature = (await headers()).get("Stripe-Signature");
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error(`🛑 Webhook signature verification failed: ${err.message}`);
      return NextResponse.json({ message: "Webhook Error" }, { status: 400 });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;

      try {
        const db = supabase();

        const { data: user, error: userError } = await db
          .from("users")
          .select("id")
          .eq("email", session.customer_email)
          .maybeSingle();

        if (userError) throw userError;

        if (!user) {
          console.error("🛑 Error: User not found for email:", session.customer_email);
          return NextResponse.json({ received: true });
        }

        const lineItems = await stripe.checkout.sessions.listLineItems(session.id, { limit: 100 });

        const { data: order, error: orderError } = await db
          .from("orders")
          .insert({
            userId: user.id,
            totalAmount: session.amount_total / 100,
            stripeSessionId: session.id,
            paymentStatus: "paid",
            orderStatus: "processing",
            shippingDetails: {
              name: session.shipping_details?.name ?? null,
              address: session.shipping_details?.address?.line1 ?? null,
              city: session.shipping_details?.address?.city ?? null,
              pincode: session.shipping_details?.address?.postal_code ?? null,
            },
          })
          .select("id")
          .single();

        // 23505 = unique_violation on stripeSessionId. Stripe retries webhooks,
        // so a replay of an event we already recorded is a success, not a
        // failure -- returning 500 would make Stripe retry it again.
        if (orderError?.code === "23505") {
          console.log("Order already recorded for session:", session.id);
          return NextResponse.json({ received: true });
        }
        if (orderError) throw orderError;

        // productId stays null: Stripe line items carry a description, not our
        // product id. The Mongoose version invented a fresh ObjectId here,
        // which pointed at nothing.
        const { error: itemsError } = await db.from("order_items").insert(
          lineItems.data.map((item) => ({
            orderId: order.id,
            productName: item.description,
            quantity: item.quantity,
            price: item.price.unit_amount / 100,
          }))
        );

        if (itemsError) throw itemsError;

      } catch (dbError) {
        console.error("🛑 Database error in webhook handler:", dbError);
        return NextResponse.json({ message: "Database Error" }, { status: 500 });
      }
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error("🛑 An unexpected error occurred in the webhook handler:", error);
    return NextResponse.json({ message: "An unexpected error occurred" }, { status: 500 });
  }
}
