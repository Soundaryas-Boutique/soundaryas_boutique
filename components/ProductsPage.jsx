"use client";
import { useEffect, useState, Fragment } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Dialog, Transition } from "@headlessui/react";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline"; // filter + close
import { ChevronDownIcon } from "@heroicons/react/20/solid"; // sort dropdown

const MAX_PRICE = 10000;

export default function ProductsPage() {
  const { category } = useParams();
  const [sarees, setSarees] = useState([]);
  const [filteredSarees, setFilteredSarees] = useState([]);

  // Filters
  const [priceRange, setPriceRange] = useState([0, MAX_PRICE]);
  const [sortBy, setSortBy] = useState("relevance");

  // Mobile sidebar state
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    if (!category) return;
    const fetchSarees = async () => {
      const res = await fetch(`/api/sarees/category/${category}`);
      const data = await res.json();
      setSarees(data);
      setFilteredSarees(data);
    };
    fetchSarees();
  }, [category]);

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

  const handleMinPriceChange = (e) => {
    const value = Math.min(Math.round(+e.target.value), priceRange[1]);
    setPriceRange([value, priceRange[1]]);
  };

  const handleMaxPriceChange = (e) => {
    const value = Math.max(Math.round(+e.target.value), priceRange[0]);
    setPriceRange([priceRange[0], value]);
  };
  const clearFilters = () => setPriceRange([0, MAX_PRICE]);

  // Dual-thumb drag
  const initDrag = (e, type) => {
    e.preventDefault();

    const move = (moveEvent) => {
      let clientX;
      if (moveEvent.type.startsWith("touch")) {
        clientX = moveEvent.touches[0].clientX;
      } else {
        clientX = moveEvent.clientX;
      }

      const rect = e.target.parentNode.getBoundingClientRect();
      let value = ((clientX - rect.left) / rect.width) * MAX_PRICE;
      value = Math.max(0, Math.min(value, MAX_PRICE));

      if (type === "min")
        setPriceRange([
          Math.round(Math.min(value, priceRange[1])),
          priceRange[1],
        ]);
      else
        setPriceRange([
          priceRange[0],
          Math.round(Math.max(value, priceRange[0])),
        ]);
    };

    const up = () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("touchend", up);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    window.addEventListener("touchmove", move);
    window.addEventListener("touchend", up);
  };

  const renderPriceFilter = () => (
    <div className="space-y-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-gray-800">Price</h3>
        <button
          onClick={clearFilters}
          className="text-sm font-medium text-gray-500 hover:text-gray-900 transition"
        >
          Clear
        </button>
      </div>

      <p className="text-center font-bold text-gray-700">
        ₹{priceRange[0].toFixed(0)} - ₹{priceRange[1].toFixed(0)}
      </p>

      {/* Dual-thumb slider */}
      <div className="relative w-full h-8 mt-4">
        {/* Track */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-1 bg-gray-300 rounded-full" />
        {/* Filled range */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-1 bg-[#B22222] rounded"
          style={{
            left: `${(priceRange[0] / MAX_PRICE) * 100}%`,
            right: `${100 - (priceRange[1] / MAX_PRICE) * 100}%`,
          }}
        />
        {/* Min thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-[#B22222] rounded-full cursor-pointer"
          style={{ left: `calc(${(priceRange[0] / MAX_PRICE) * 100}% - 10px)` }}
          onMouseDown={(e) => initDrag(e, "min")}
          onTouchStart={(e) => initDrag(e, "min")}
        />

        {/* Max thumb */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 bg-[#B22222] rounded-full cursor-pointer"
          style={{ left: `calc(${(priceRange[1] / MAX_PRICE) * 100}% - 10px)` }}
          onMouseDown={(e) => initDrag(e, "max")}
          onTouchStart={(e) => initDrag(e, "max")}
        />
      </div>

      {/* Input Fields */}
      <div className="flex items-center justify-between mt-4">
        <input
          type="number"
          value={priceRange[0]}
          onChange={handleMinPriceChange}
          className="w-24 border rounded p-2 text-center"
        />
        <span>-</span>
        <input
          type="number"
          value={priceRange[1]}
          onChange={handleMaxPriceChange}
          className="w-24 border rounded p-2 text-center"
        />
      </div>
    </div>
  );

  return (
    <main className="max-w-[1440px] mx-auto py-8 px-4 md:px-8">
      <h2 className="text-3xl font-bold text-[#B22222] uppercase mb-6">
        {category ? category.replace("-", " ") : "Loading..."}
      </h2>

      {/* Mobile Top Bar */}
      <div className="flex justify-between items-center md:hidden mb-6">
        <button
          className="flex items-center gap-2 border rounded px-3 py-2"
          onClick={() => setIsFilterOpen(true)}
        >
          <FunnelIcon className="w-5 h-5" />
          <span>Filter</span>
        </button>
        <div className="relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border rounded px-3 py-2 pr-8 appearance-none"
          >
            <option value="relevance">Relevance</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
          <ChevronDownIcon className="w-4 h-4 absolute right-2 top-3 text-gray-500 pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-8">
        {/* Sidebar (desktop only) */}
        <aside className="hidden md:block md:col-span-1 space-y-8">
          {renderPriceFilter()}
        </aside>

        {/* Products */}
        <section className="md:col-span-3 lg:col-span-4">
          {/* Desktop sort + results */}
          <div className="hidden md:flex justify-between items-center mb-6">
            <p className="text-gray-600">{filteredSarees.length} results</p>
            <div className="flex items-center gap-2">
              <label className="text-gray-700">Sort by:</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border rounded p-2"
              >
                <option value="relevance">Relevance</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-6">
            {filteredSarees.length > 0 ? (
              filteredSarees.map((saree) => (
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
                  <div className="p-4">
                    <h3 className="text-sm text-center font-bold text-gray-700">
                      {saree.productName}
                    </h3>
                    <p className="text-gray-700 text-sm text-center">
                      ₹{saree.price}
                    </p>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-center text-gray-600 w-full col-span-full">
                No sarees found in this category.
              </p>
            )}
          </div>
        </section>
      </div>

      {/* Mobile Sidebar */}
      <Transition show={isFilterOpen} as={Fragment}>
        <Dialog
          onClose={() => setIsFilterOpen(false)}
          className="relative z-50 md:hidden"
        >
          {/* Overlay */}
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div
              className="fixed inset-0 bg-black/40"
              aria-hidden="true"
              onClick={() => setIsFilterOpen(false)}
            />
          </Transition.Child>

          {/* Sidebar */}
          <Transition.Child
            as={Fragment}
            enter="transition-transform ease-in-out duration-300"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition-transform ease-in-out duration-300"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <div className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-white p-6 overflow-y-auto shadow-lg">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-gray-800">Filters</h3>
                <button onClick={() => setIsFilterOpen(false)}>
                  <XMarkIcon className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              {/* Price Filter */}
              <div className="mb-6">{renderPriceFilter()}</div>

              <button
                onClick={() => setIsFilterOpen(false)}
                className="w-full bg-black text-white py-2 rounded"
              >
                Apply
              </button>
            </div>
          </Transition.Child>
        </Dialog>
      </Transition>
    </main>
  );
}
