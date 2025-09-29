import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose2";
import Order from "@/app/(models)/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function GET(req) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    
    // Use the user ID from the session (must be available if user is authenticated)
    const userId = session.user.id;
    
    // Find all orders for the current user, sort by latest
    const orders = await Order.find({ userId: userId }).sort({ createdAt: -1 });

    // Important: Serialize data before sending to client component
    const serializedOrders = JSON.parse(JSON.stringify(orders));

    return NextResponse.json(serializedOrders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}