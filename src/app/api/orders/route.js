import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose";
import Order from "@/app/(models)/Order";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

export async function GET(req) {
  const session = await getServerSession(authOptions);

  // ✅ CRITICAL FIX: Only check if a session exists.
  // This allows any logged-in user to view their own orders.
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectDB();
    const userId = session.user.id;
    const orders = await Order.find({ userId: userId }).sort({ createdAt: -1 });

    const serializedOrders = JSON.parse(JSON.stringify(orders));
    return NextResponse.json(serializedOrders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}