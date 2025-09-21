"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { FaFilter, FaSortAmountDownAlt } from "react-icons/fa";

// Define an array of price filter options with a "label" and "value"
const priceFilters = [
  { label: "All Prices", value: [0, 100000] },
  { label: "Under ₹500", value: [0, 500] },
  { label: "₹500 - ₹1,000", value: [500, 1000] },
  { label: "₹1,000 - ₹2,000", value: [1000, 2000] },
  { label: "₹2,000 - ₹5,000", value: [2000, 5000] },
  { label: "₹5,000 & Above", value: [5000, 100000] },
];

export default function ProductsListClient({ initialSarees, category }) {
  const [sarees, setSarees] = useState(initialSarees);
  const [filteredSarees, setFilteredSarees] = useState(initialSarees);
  const [priceRange, setPriceRange] = useState(priceFilters[0].value);
  const [sortBy, setSortBy] = useState("relevance");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

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

  const handlePriceFilterChange = (e) => {
    const selectedValue = JSON.parse(e.target.value);
    setPriceRange(selectedValue);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Category Header & Sort/Filter Controls */}
      <div className="mb-6 flex flex-col items-start justify-between md:flex-row md:items-center">
        <h1 className="text-3xl font-bold capitalize text-gray-800">
          {category} Sarees
        </h1>
        {/* Mobile Filter & Sort Controls */}
        <div className="mt-4 flex w-full items-center justify-between md:hidden">
          <button
            onClick={() => setShowMobileFilters(true)}
            className="flex items-center gap-2 rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
          >
            <FaFilter /> Filter
          </button>
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="appearance-none rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="relevance">Sort by: Relevance</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <FaSortAmountDownAlt className="h-4 w-4" />
            </div>
          </div>
        </div>

        {/* Desktop sort control */}
        <div className="hidden md:block">
          <label htmlFor="sort-by" className="mr-2 text-sm font-medium text-gray-700">
            Sort by:
          </label>
          <select
            id="sort-by"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="rounded border p-2 text-sm"
          >
            <option value="relevance">Relevance</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Main Content: Sidebar for desktop & Products Grid */}
      <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:grid-cols-5">
        {/* Sidebar (Desktop) */}
        <aside className="hidden space-y-8 md:col-span-1 md:block">
          <div>
            <h3 className="mb-3 text-lg font-bold text-gray-800">Filters</h3>
            <div className="relative">
              <select
                value={JSON.stringify(priceRange)}
                onChange={handlePriceFilterChange}
                className="w-full rounded border p-2 text-sm appearance-none"
              >
                {priceFilters.map((filter) => (
                  <option key={filter.label} value={JSON.stringify(filter.value)}>
                    {filter.label}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <FaSortAmountDownAlt className="h-4 w-4 rotate-180" />
              </div>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <section className="md:col-span-3 lg:col-span-4">
          {filteredSarees.length > 0 ? (
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {filteredSarees.map((saree) => (
                <Link
                  key={saree._id}
                  href={`/collections/${saree.category}/${encodeURIComponent(
                    saree.productName.toLowerCase().replace(/\s+/g, "-")
                  )}`}
                  className="group block rounded-lg bg-white p-2 shadow-sm transition-transform duration-300 hover:scale-[1.02] hover:shadow-md"
                >
                  <div className="overflow-hidden rounded-lg">
                    {saree.imgSrc && (
                      <img
                        src={saree.imgSrc}
                        alt={saree.productName}
                        className="w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    )}
                  </div>
                  <div className="p-3 text-center">
                    <h3 className="truncate text-sm font-bold text-gray-800">
                      {saree.productName}
                    </h3>
                    <p className="mt-1 text-base font-semibold text-gray-700">
                      ₹{saree.price}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="py-20 text-center text-gray-600">
              No sarees found in this category with the selected filters.
            </p>
          )}
        </section>
      </div>

      {/* Mobile Filter Modal */}
      {showMobileFilters && (
        <div
          className="fixed inset-0 z-50 bg-black bg-opacity-50"
          onClick={() => setShowMobileFilters(false)}
        >
          <div
            className="absolute bottom-0 left-0 right-0 rounded-t-lg bg-white p-6 shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-4 text-xl font-bold text-gray-800">Filters</h2>
            <div className="space-y-6">
              <div>
                <h3 className="mb-2 text-lg font-semibold text-gray-800">
                  Price
                </h3>
                <div className="relative">
                  <select
                    value={JSON.stringify(priceRange)}
                    onChange={handlePriceFilterChange}
                    className="w-full rounded border p-2 text-sm appearance-none"
                  >
                    {priceFilters.map((filter) => (
                      <option key={filter.label} value={JSON.stringify(filter.value)}>
                        {filter.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <FaSortAmountDownAlt className="h-4 w-4 rotate-180" />
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="mt-6 w-full rounded-md bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}