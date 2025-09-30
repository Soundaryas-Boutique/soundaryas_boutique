import { NextResponse } from "next/server";
import { connectDB } from "@/app/lib/mongoose2";
import Order from "@/app/(models)/Order";
import User from "@/app/(models)/User";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";

// Helper function to check admin status
const isAdmin = async (session) => {
  return session && session.user.role === "Admin";
};

// GET: Fetch ALL orders for Admin Dashboard
export async function GET() {
  const session = await getServerSession(authOptions);
  if (! await isAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  await connectDB();
  try {
    // Fetch all orders and populate the user details for context
    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .populate('userId', 'name email'); // Fetch only name and email from User model

    const serializedOrders = JSON.parse(JSON.stringify(orders));
    return NextResponse.json(serializedOrders);
  } catch (err) {
    console.error("Admin GET Orders Error:", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// PUT: Update Order Status by ID (e.g., processing -> shipped)
export async function PUT(request) {
  const session = await getServerSession(authOptions);
  if (! await isAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  await connectDB();
  try {
    const { orderId, newStatus } = await request.json();

    if (!orderId || !newStatus) {
      return NextResponse.json({ error: "Missing order ID or new status" }, { status: 400 });
    }

    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: newStatus },
      { new: true }
    );

    if (!updatedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Status updated successfully", order: updatedOrder }, { status: 200 });

  } catch (err) {
    console.error("Admin PUT Order Status Error:", err);
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 });
  }
}

// DELETE: Remove an order
export async function DELETE(request) {
  const session = await getServerSession(authOptions);
  if (! await isAdmin(session)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  await connectDB();
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    if (!orderId) {
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }
    
    const deletedOrder = await Order.findByIdAndDelete(orderId);

    if (!deletedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order deleted successfully" }, { status: 200 });

  } catch (err) {
    console.error("Admin DELETE Order Error:", err);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}