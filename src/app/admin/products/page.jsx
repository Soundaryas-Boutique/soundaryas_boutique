import Link from "next/link";
import { redirect } from "next/navigation";
import { supabase } from "@/app/lib/supabase";
import { isAdmin } from "@/app/lib/authUtils";
import ProductsTable from "./ProductsTable";

export const metadata = {
  title: "Manage Products | Admin",
};

export default async function AdminProducts() {
  // The admin layout guards this too, but layouts and pages render
  // concurrently, so the layout's redirect does not stop this query running.
  if (!(await isAdmin())) {
    redirect("/Denied");
  }

  const { data: products, error } = await supabase()
    .from("sarees")
    .select("id, productName, category, price, discountPrice, stock, images")
    .order("createdAt", { ascending: false });

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Manage Products</h1>
        <Link
          href="/admin/products/add"
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          + Add Product
        </Link>
      </div>

      {error ? (
        <p role="alert" className="text-red-500">
          Failed to load products. {error.message}
        </p>
      ) : (
        <ProductsTable initialProducts={products} />
      )}
    </div>
  );
}
