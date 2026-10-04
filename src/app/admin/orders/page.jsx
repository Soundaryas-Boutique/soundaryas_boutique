import { redirect } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { isAdmin } from "@/app/lib/authUtils";
import { ADMIN_ORDER_FIELDS } from "@/app/lib/orders";
import OrdersDashboard from "../../../../components/admin/OrdersDashboard";

export const metadata = {
  title: "Orders | Admin",
};

export default async function AdminOrdersPage() {
  // Layouts and pages render concurrently, so the admin layout's redirect
  // does not stop this query from running.
  if (!(await isAdmin())) {
    redirect("/Denied");
  }

  const { data: orders, error } = await supabase()
    .from("orders")
    .select(ADMIN_ORDER_FIELDS)
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error fetching orders:", error);
    return (
      <p role="alert" className="text-red-700">
        Failed to load orders. {error.message}
      </p>
    );
  }

  return <OrdersDashboard initialOrders={orders} />;
}
