import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose2";
import Order from "@/app/(models)/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  if (!session) { // ✅ CRITICAL FIX: Only check if a session exists
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const userId = session.user.id;

    console.log("Fetching orders for userId:", userId);
    const orders = await Order.find({ userId: userId }).sort({ createdAt: -1 });
    console.log("Database query result:", orders);
    
    const serializedOrders = JSON.parse(JSON.stringify(orders));
    return NextResponse.json(serializedOrders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}