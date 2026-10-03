import { NextResponse } from "next/server";
import { supabase } from "@/app/lib/supabase";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/lib/auth";
import { ORDER_FIELDS } from "@/app/lib/orders";

export async function GET() {
  const session = await getServerSession(authOptions);

  // ✅ CRITICAL FIX: Only check if a session exists.
  // This allows any logged-in user to view their own orders.
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: orders, error } = await supabase()
      .from("orders")
      .select(ORDER_FIELDS)
      .eq("userId", session.user.id)
      .order("createdAt", { ascending: false });

    if (error) throw error;
    return NextResponse.json(orders);
  } catch (err) {
    console.error("Error fetching user orders:", err);
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}
