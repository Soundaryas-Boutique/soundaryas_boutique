"use client";

import { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "@heroicons/react/20/solid";
import SareeCard from "./SareeCard";

export default function ProductsList({ initialSarees, category }) {
  const [sarees, setSarees] = useState(initialSarees || []);
  const [filteredSarees, setFilteredSarees] = useState(initialSarees || []);

  // Filter States
  const prices = initialSarees?.map((s) => s.price) || [0, 10000];
  const minPossible = Math.min(...prices);
  const maxPossible = Math.max(...prices);
  
  const [priceRange, setPriceRange] = useState([minPossible, maxPossible]);
  const [sortBy, setSortBy] = useState("relevance");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Sync state if initialSarees change (prop updates)
  useEffect(() => {
    setSarees(initialSarees);
    const newPrices = initialSarees?.map((s) => s.price) || [0, 10000];
    const newMin = Math.min(...newPrices);
    const newMax = Math.max(...newPrices);
    setPriceRange([newMin, newMax]);
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

  const handleMinPriceChange = (e) => {
    const value = Math.min(Math.round(+e.target.value), priceRange[1]);
    setPriceRange([value, priceRange[1]]);
  };

  const handleMaxPriceChange = (e) => {
    const value = Math.max(Math.round(+e.target.value), priceRange[0]);
    setPriceRange([priceRange[0], value]);
  };

  const clearFilters = () => setPriceRange([minPossible, maxPossible]);

  // Dual-thumb drag logic
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
      let value =
        ((clientX - rect.left) / rect.width) * (maxPossible - minPossible) + minPossible;
      value = Math.max(minPossible, Math.min(value, maxPossible));

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
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-secondary text-primary uppercase tracking-widest font-bold">
          Price Range
        </h3>
        <button
          onClick={clearFilters}
          className="text-[10px] uppercase tracking-widest text-secondary hover:text-primary transition font-bold"
        >
          Reset
        </button>
      </div>

      <div className="flex items-center justify-between px-1">
        <span className="text-xs font-main text-grey-medium">₹{priceRange[0].toLocaleString('en-IN')}</span>
        <span className="text-xs font-main text-grey-medium">₹{priceRange[1].toLocaleString('en-IN')}</span>
      </div>

      {/* Dual-thumb slider */}
      <div className="relative w-full h-6 flex items-center">
        {/* Track */}
        <div className="absolute w-full h-0.5 bg-ivory/50 rounded-full" />
        
        {/* Filled range */}
        <div
          className="absolute h-0.5 bg-secondary rounded"
          style={{
            left: `${((priceRange[0] - minPossible) / (maxPossible - minPossible)) * 100}%`,
            right: `${100 - ((priceRange[1] - minPossible) / (maxPossible - minPossible)) * 100}%`,
          }}
        />

        {/* Min thumb */}
        <div
          className="absolute w-4 h-4 bg-primary border-2 border-white rounded-full cursor-pointer shadow-sm transition-transform hover:scale-125 z-10"
          style={{
            left: `calc(${((priceRange[0] - minPossible) / (maxPossible - minPossible)) * 100}% - 8px)`,
          }}
          onMouseDown={(e) => initDrag(e, "min")}
          onTouchStart={(e) => initDrag(e, "min")}
        />

        {/* Max thumb */}
        <div
          className="absolute w-4 h-4 bg-primary border-2 border-white rounded-full cursor-pointer shadow-sm transition-transform hover:scale-125 z-10"
          style={{
            left: `calc(${((priceRange[1] - minPossible) / (maxPossible - minPossible)) * 100}% - 8px)`,
          }}
          onMouseDown={(e) => initDrag(e, "max")}
          onTouchStart={(e) => initDrag(e, "max")}
        />
      </div>

      {/* Input Fields (Manual) */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-medium text-[10px]">₹</span>
          <input
            type="number"
            value={priceRange[0]}
            onChange={handleMinPriceChange}
            className="w-full border border-ivory bg-transparent py-2 pl-6 pr-2 text-xs font-main focus:ring-1 focus:ring-secondary/30 outline-none transition-all"
          />
        </div>
        <span className="text-grey-medium">–</span>
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-grey-medium text-[10px]">₹</span>
          <input
            type="number"
            value={priceRange[1]}
            onChange={handleMaxPriceChange}
            className="w-full border border-ivory bg-transparent py-2 pl-6 pr-2 text-xs font-main focus:ring-1 focus:ring-secondary/30 outline-none transition-all"
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full bg-white">
      {/* Mobile Sorting & Filter Bar */}
      <div className="flex justify-between items-center md:hidden mb-8 gap-4">
        <button
          className="flex-1 flex items-center justify-center gap-2 border border-ivory py-3 text-[10px] uppercase tracking-widest font-bold text-primary hover:bg-grey-light transition-colors"
          onClick={() => setIsFilterOpen(true)}
        >
          <FunnelIcon className="w-4 h-4" />
          Filter
        </button>
        <div className="flex-1 relative">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full border border-ivory py-3 pl-4 pr-8 text-[10px] uppercase tracking-widest font-bold text-primary appearance-none bg-transparent outline-none"
          >
            <option value="relevance">By Relevance</option>
            <option value="low-high">Lowest Price</option>
            <option value="high-low">Highest Price</option>
          </select>
          <ChevronDownIcon className="w-3 h-3 absolute right-4 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 lg:gap-16">
        {/* Sidebar (Desktop) */}
        <aside className="hidden md:block md:col-span-1 border-r border-ivory/30 pr-8">
          <div className="sticky top-40 space-y-12">
            {renderPriceFilter()}
            
            <div className="pt-8 border-t border-ivory/50">
              <h3 className="text-sm font-secondary text-primary uppercase tracking-widest font-bold mb-4">
                Category
              </h3>
              <p className="text-xs text-secondary font-main uppercase tracking-widest font-semibold italic">
                {category?.replace("-", " ")}
              </p>
            </div>

            <div className="pt-8 border-t border-ivory/50 opacity-40">
              <p className="text-[9px] uppercase tracking-[0.2em] font-medium leading-relaxed">
                Every piece is a story of craft, patience, and tradition.
              </p>
            </div>
          </div>
        </aside>

        {/* Product Listings Section */}
        <section className="md:col-span-3 lg:col-span-4">
          {/* Desktop Summary Bar */}
          <div className="hidden md:flex justify-between items-center mb-10 pb-4 border-b border-ivory/30">
            <p className="text-[10px] uppercase tracking-[0.2em] text-grey-medium font-medium">
              Showing {filteredSarees.length} artisanal pieces
            </p>
            <div className="flex items-center gap-8">
              <div className="flex items-center gap-4">
                <span className="text-[10px] uppercase tracking-[0.2em] text-grey-medium font-bold">SortBy:</span>
                <div className="relative min-w-[160px]">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-transparent text-[10px] uppercase tracking-[0.2em] font-bold text-primary py-2 pr-8 border-none focus:ring-0 cursor-pointer appearance-none outline-none"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="low-high">Price: Low to High</option>
                    <option value="high-low">Price: High to Low</option>
                  </select>
                  <ChevronDownIcon className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
                </div>
              </div>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8">
            {filteredSarees.length > 0 ? (
              filteredSarees.map((saree) => (
                <SareeCard key={saree._id} saree={saree} />
              ))
            ) : (
              <div className="col-span-full py-32 flex flex-col items-center text-center">
                <div className="w-12 h-px bg-ivory/50 mb-6" />
                <p className="font-main italic text-grey-medium mb-4">
                  "No pieces currently match your unique selection."
                </p>
                <button 
                  onClick={clearFilters}
                  className="text-xs uppercase tracking-widest text-primary font-bold hover:text-secondary transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Mobile Drawer (Filter) */}
      <Transition show={isFilterOpen} as={Fragment}>
        <Dialog onClose={() => setIsFilterOpen(false)} className="relative z-50 md:hidden">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/40" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition-transform ease-in-out duration-300"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition-transform ease-in-out duration-300"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-white p-8 flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-12">
                <h2 className="text-xl font-secondary tracking-tight text-primary uppercase">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)}>
                  <XMarkIcon className="w-6 h-6 text-grey-medium" />
                </button>
              </div>

              <div className="flex-1 space-y-12">
                {renderPriceFilter()}
              </div>

              <div className="mt-8 pt-6 border-t border-ivory">
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full btn-primary py-4 text-xs tracking-[0.2em]"
                >
                  Show Results
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </div>
  );
}
