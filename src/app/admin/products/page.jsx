"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/sarees");
      if (!res.ok) throw new Error("Failed to fetch products");
      const data = await res.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/sarees/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete product");
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

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
            <tr key={p._id} className="text-center hover:bg-gray-50">
              <td className="border p-2">
                {p.images && p.images[0] ? (
                  <img
                    src={p.images[0].url}
                    alt={p.images[0].alt || p.productName}
                    className="h-16 w-16 object-cover mx-auto"
                  />
                ) : (
                  "No Image"
                )}
              </td>
              <td className="border p-2">{p.productName}</td>
              <td className="border p-2">{p.category}</td>
              <td className="border p-2">
                {p.discountPrice ? (
                  <span>
                    <span className="line-through mr-1">{p.price}</span>
                    <span className="text-green-600">{p.discountPrice}</span>
                  </span>
                ) : (
                  p.price
                )}
              </td>
              <td className="border p-2">{p.stock}</td>
              <td className="border p-2 space-x-2">
                <Link
                  href={`/admin/products/edit/${p._id}`}
                  className="bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(p._id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
