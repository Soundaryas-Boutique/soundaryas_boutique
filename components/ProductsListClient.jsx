"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProductsListClient({ initialSarees, category }) {
  const [sarees, setSarees] = useState(initialSarees);
  const [filteredSarees, setFilteredSarees] = useState(initialSarees);

  // Filters
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [sortBy, setSortBy] = useState("relevance");

  useEffect(() => {
    if (initialSarees.length > 0) {
      const prices = initialSarees.map((s) => s.price);
      setMinPrice(Math.min(...prices));
      setMaxPrice(Math.max(...prices));
      setPriceRange([Math.min(...prices), Math.max(...prices)]);
    }
  }, [initialSarees]);

  // Apply filters & sorting
  useEffect(() => {
    let result = sarees.filter(
      (s) => s.price >= priceRange[0] && s.price <= priceRange[1]
    );

    if (sortBy === "low-high")
      result = [...result].sort((a, b) => a.price - b.price);
    else if (sortBy === "high-low")
      result = [...result].sort((a, b) => b.price - a.price);

    setFilteredSarees(result);
  }, [sarees, priceRange, sortBy]);

  const handleMinPriceChange = (e) =>
    setPriceRange([Math.min(+e.target.value, priceRange[1]), priceRange[1]]);
  const handleMaxPriceChange = (e) =>
    setPriceRange([priceRange[0], Math.max(+e.target.value, priceRange[0])]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
      {/* Sidebar (desktop) */}
      <aside className="hidden md:block md:col-span-1 space-y-8">
        <div>
          <h3 className="font-bold text-lg text-gray-800 mb-2">Price</h3>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={priceRange[0]}
              onChange={handleMinPriceChange}
              className="w-20 border rounded p-1 text-center"
            />
            <span>-</span>
            <input
              type="number"
              value={priceRange[1]}
              onChange={handleMaxPriceChange}
              className="w-20 border rounded p-1 text-center"
            />
          </div>
        </div>

        <div>
          <label>Sort by:</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full border rounded p-1 mt-1"
          >
            <option value="relevance">Relevance</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>
      </aside>

      {/* Products */}
      <section className="md:col-span-3 lg:col-span-4">
        {filteredSarees.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredSarees.map((saree) => (
              <Link
                key={saree._id}
                href={`/collections/${saree.category}/${encodeURIComponent(
                  saree.productName.toLowerCase().replace(/\s+/g, "-")
                )}`}
                className="bg-white hover:shadow-md transition overflow-hidden block"
              >
                {saree.imgSrc && (
                  <img
                    src={saree.imgSrc}
                    alt={saree.productName}
                    className="w-full object-contain"
                  />
                )}
                <div className="p-2">
                  <h3 className="text-sm text-center font-bold text-gray-700">
                    {saree.productName}
                  </h3>
                  <p className="text-gray-700 text-sm text-center">
                    ₹{saree.price}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-600 py-20">
            No sarees found in this category.
          </p>
        )}
      </section>
    </div>
  );
}
