"use client";

import React, { useState } from "react";

export default function ProductPageClient({ product }) {
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || "");
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    // Add product to cart logic here
    console.log("Added to cart:", { product, selectedSize, selectedColor, quantity });
    alert("Product added to cart!");
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-4">{product.productName}</h1>

      {/* Product images */}
      <div className="flex gap-4 mb-6">
        {product.images?.map((img, idx) => (
          <img
            key={idx}
            src={img.url}
            alt={img.alt || product.productName}
            className="w-48 h-48 object-cover rounded-lg"
          />
        ))}
      </div>

      {/* Description & price */}
      <p className="mb-2">{product.description}</p>
      <p className="text-xl font-semibold mb-4">
        ₹{product.discountPrice || product.price}{" "}
        {product.discountPrice && (
          <span className="line-through text-gray-500 ml-2">₹{product.price}</span>
        )}
      </p>

      {/* Options */}
      <div className="flex gap-4 mb-4">
        {product.sizes?.length > 0 && (
          <select
            value={selectedSize}
            onChange={(e) => setSelectedSize(e.target.value)}
            className="border p-2 rounded"
          >
            {product.sizes.map((size, idx) => (
              <option key={idx} value={size}>
                {size}
              </option>
            ))}
          </select>
        )}

        {product.colors?.length > 0 && (
          <select
            value={selectedColor}
            onChange={(e) => setSelectedColor(e.target.value)}
            className="border p-2 rounded"
          >
            {product.colors.map((color, idx) => (
              <option key={idx} value={color}>
                {color}
              </option>
            ))}
          </select>
        )}

        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border p-2 rounded w-20"
        />
      </div>

      <button
        onClick={handleAddToCart}
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
      >
        Add to Cart
      </button>
    </div>
  );
}
