import { redirect } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { isAdmin } from "@/app/lib/authUtils";
import ProductsTable from "./ProductsTable";

export const metadata = {
  title: "Products | Admin",
};

export default async function AdminProducts() {
  // Layouts and pages render concurrently, so the admin layout's redirect
  // does not stop this query from running.
  if (!(await isAdmin())) {
    redirect("/Denied");
  }

  const { data: products, error } = await supabase()
    .from("sarees")
    .select("id, productName, category, price, discountPrice, stock, status, images")
    .order("createdAt", { ascending: false });

  if (error) {
    console.error("Error fetching products:", error);
    return (
      <p role="alert" className="text-red-700">
        Failed to load products. {error.message}
      </p>
    );
  }

  return <ProductsTable initialProducts={products} />;
}
