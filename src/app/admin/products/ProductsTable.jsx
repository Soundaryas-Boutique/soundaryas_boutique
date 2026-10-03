"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/app/lib/money";

/**
 * The interactive half of the products screen. The page fetches the rows on
 * the server and passes them in; this only owns the delete interaction.
 */
export default function ProductsTable({ initialProducts }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    setError("");
    setDeletingId(id);
    try {
      const res = await fetch(`/api/sarees/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete product");

      setProducts((current) => current.filter((p) => p.id !== id));
      // Keep the server's copy in step, so a refresh does not resurrect the row.
      router.refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId(null);
    }
  };

  if (products.length === 0) {
    return (
      <p className="py-12 text-center text-grey-medium italic">
        No products yet. Add your first one to get started.
      </p>
    );
  }

  return (
    <>
      {error && (
        <p role="alert" className="mb-4 text-red-600">
          {error}
        </p>
      )}

      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Image</th>
            <th className="border p-2">Name</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Stock</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="text-center hover:bg-gray-50">
              <td className="border p-2">
                {p.images && p.images[0] ? (
                  <Image
                    src={p.images[0].url}
                    alt={p.images[0].alt || p.productName}
                    width={64}
                    height={64}
                    sizes="64px"
                    className="h-16 w-16 object-cover mx-auto"
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td className="border p-2">{p.productName}</td>
              <td className="border p-2">{p.category}</td>
              <td className="border p-2 tabular-nums">
                {p.discountPrice ? (
                  <span>
                    <span className="line-through mr-1">
                      {formatPrice(p.price)}
                    </span>
                    <span className="text-green-600">
                      {formatPrice(p.discountPrice)}
                    </span>
                  </span>
                ) : (
                  formatPrice(p.price)
                )}
              </td>
              <td className="border p-2 tabular-nums">{p.stock}</td>
              <td className="border p-2 space-x-2">
                <Link
                  href={`/admin/products/edit/${p.id}`}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(p.id)}
                  disabled={deletingId === p.id}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 disabled:opacity-50"
                >
                  {deletingId === p.id ? "Deleting…" : "Delete"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
