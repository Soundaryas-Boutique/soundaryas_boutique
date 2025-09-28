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
    
    const userId = session.user.id;
    // Find all orders for the current user, sorted by creation date
    const orders = await Order.find({ userId: userId }).sort({ createdAt: -1 });

    return NextResponse.json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}