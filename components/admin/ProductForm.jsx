"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ProductForm({ productId }) {
  const router = useRouter();
  const isEdit = Boolean(productId);

  const [product, setProduct] = useState({
    productName: "",
    description: "",
    price: "",
    discountPrice: "",
    stock: "",
    category: "Silk",
    tags: "",
    colors: "",
    sizes: "",
    material: "",
    slug: "",
    isFeatured: false,
    status: "active",
  });

  const [loading, setLoading] = useState(false);

  // Fetch existing product if editing
  useEffect(() => {
    if (isEdit) {
      fetch(`/api/sarees/${productId}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct({
            ...data,
            tags: data.tags.join(", "),
            colors: data.colors.join(", "),
            sizes: data.sizes.join(", "),
          });
        })
        .catch((err) => console.error("Failed to fetch product:", err));
    }
  }, [productId, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProduct((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...product,
        tags: product.tags ? product.tags.split(",").map((i) => i.trim()) : [],
        colors: product.colors ? product.colors.split(",").map((i) => i.trim()) : [],
        sizes: product.sizes ? product.sizes.split(",").map((i) => i.trim()) : [],
        price: Number(product.price),
        discountPrice: product.discountPrice ? Number(product.discountPrice) : null,
        stock: Number(product.stock),
      };

      const res = await fetch(isEdit ? `/api/sarees/${productId}` : "/api/sarees", {
        method: isEdit ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save product");
      router.push("/admin/products");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">{isEdit ? "Edit Product" : "Add Product"}</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="productName"
          value={product.productName}
          onChange={handleChange}
          placeholder="Product Name"
          required
          className="w-full border p-2 rounded"
        />
        <textarea
          name="description"
          value={product.description}
          onChange={handleChange}
          placeholder="Description"
          rows={4}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="price"
          value={product.price}
          onChange={handleChange}
          placeholder="Price"
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="discountPrice"
          value={product.discountPrice}
          onChange={handleChange}
          placeholder="Discount Price (optional)"
          className="w-full border p-2 rounded"
        />
        <input
          type="number"
          name="stock"
          value={product.stock}
          onChange={handleChange}
          placeholder="Stock Quantity"
          required
          className="w-full border p-2 rounded"
        />
        {/* Category select */}
        <select
          name="category"
          value={product.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="Silk">Silk</option>
          <option value="Cotton">Cotton</option>
          <option value="Designer">Designer</option>
          <option value="Banarasi">Banarasi</option>
          <option value="Casual">Casual</option>
          <option value="Other">Other</option>
        </select>
        <input
          type="text"
          name="tags"
          value={product.tags}
          onChange={handleChange}
          placeholder="Tags (comma separated)"
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="colors"
          value={product.colors}
          onChange={handleChange}
          placeholder="Colors (comma separated)"
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="sizes"
          value={product.sizes}
          onChange={handleChange}
          placeholder="Sizes (comma separated)"
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="material"
          value={product.material}
          onChange={handleChange}
          placeholder="Material"
          className="w-full border p-2 rounded"
        />
        <input
          type="text"
          name="slug"
          value={product.slug}
          onChange={handleChange}
          placeholder="Slug (unique)"
          required
          className="w-full border p-2 rounded"
        />
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              name="isFeatured"
              checked={product.isFeatured}
              onChange={handleChange}
            />
            <span>Featured Product</span>
          </label>
          <select
            name="status"
            value={product.status}
            onChange={handleChange}
            className="border p-1 rounded"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={loading}
          className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
        >
          {loading ? "Saving..." : isEdit ? "Update Product" : "Add Product"}
        </button>
      </form>
    </div>
  );
}
