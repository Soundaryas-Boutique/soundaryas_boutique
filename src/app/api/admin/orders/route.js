import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { isAdmin } from "@/app/lib/authUtils";
import { ADMIN_ORDER_FIELDS, ORDER_FIELDS } from "@/app/lib/orders";

// GET: Fetch ALL orders for Admin Dashboard
export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  try {
    const { data: orders, error } = await supabase()
      .from("orders")
      .select(ADMIN_ORDER_FIELDS)
      .order("createdAt", { ascending: false });

    if (error) throw error;
    return NextResponse.json(orders);
  } catch (err) {
    console.error("Admin GET Orders Error:", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

// PUT: Update Order Status by ID (e.g., processing -> shipped)
export async function PUT(request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  try {
    const { orderId, newStatus } = await request.json();

    if (!orderId || !newStatus) {
      return NextResponse.json({ error: "Missing order ID or new status" }, { status: 400 });
    }

    const validStatuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
    if (!validStatuses.includes(newStatus)) {
      return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
    }

    const { data: updatedOrder, error } = await supabase()
      .from("orders")
      .update({ orderStatus: newStatus })
      .eq("id", orderId)
      .select(ORDER_FIELDS)
      .maybeSingle();

    if (error) throw error;

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
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    if (!orderId) {
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    // order_items rows go with it via ON DELETE CASCADE.
    const { data: deletedOrder, error } = await supabase()
      .from("orders")
      .delete()
      .eq("id", orderId)
      .select("id")
      .maybeSingle();

    if (error) throw error;

    if (!deletedOrder) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Order deleted successfully" }, { status: 200 });

  } catch (err) {
    console.error("Admin DELETE Order Error:", err);
    return NextResponse.json({ error: "Failed to delete order" }, { status: 500 });
  }
}
