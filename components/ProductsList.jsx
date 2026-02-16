"use client";

import { useEffect, useState, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { 
  FunnelIcon, 
  XMarkIcon,
  AdjustmentsHorizontalIcon,
  Bars3BottomLeftIcon
} from "@heroicons/react/24/outline";
import { ChevronDownIcon, SparklesIcon } from "@heroicons/react/20/solid";
import SareeCard from "./SareeCard";

const PRICE_RANGES = [
  { label: "All Pieces", min: 0, max: 1000000 },
  { label: "Below ₹1,000", min: 0, max: 1000 },
  { label: "₹1,000 - ₹3,000", min: 1000, max: 3000 },
  { label: "₹3,000 - ₹5,000", min: 3000, max: 5000 },
  { label: "₹5,000 - ₹10,000", min: 5000, max: 10000 },
  { label: "Above ₹10,000", min: 10000, max: 1000000 },
];

export default function ProductsList({ initialSarees, category }) {
  const [sarees, setSarees] = useState(initialSarees || []);
  const [filteredSarees, setFilteredSarees] = useState(initialSarees || []);

  // Filter States
  const [activeRange, setActiveRange] = useState(PRICE_RANGES[0]);
  const [sortBy, setSortBy] = useState("relevance");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    setSarees(initialSarees);
  }, [initialSarees]);

  useEffect(() => {
    let result = sarees.filter(
      (s) => s.price >= activeRange.min && s.price <= activeRange.max
    );

    if (sortBy === "low-high")
      result = [...result].sort((a, b) => a.price - b.price);
    else if (sortBy === "high-low")
      result = [...result].sort((a, b) => b.price - a.price);

    setFilteredSarees(result);
  }, [sarees, activeRange, sortBy]);

  const renderPriceFilters = () => (
    <div className="space-y-6">
      <div className="border-b border-ivory/50 pb-4">
        <h3 className="text-sm font-secondary text-primary uppercase tracking-widest font-bold mb-1">
          Filter By
        </h3>
        <p className="text-[10px] text-grey-medium uppercase tracking-[0.1em]">Price Range</p>
      </div>

      <div className="space-y-3">
        {PRICE_RANGES.map((range) => (
          <button
            key={range.label}
            onClick={() => setActiveRange(range)}
            className={`flex items-center gap-3 w-full group transition-all`}
          >
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
              activeRange.label === range.label ? 'border-secondary bg-secondary' : 'border-ivory group-hover:border-grey-medium'
            }`}>
              {activeRange.label === range.label && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
            </div>
            <span className={`text-xs font-main transition-colors ${
              activeRange.label === range.label ? 'text-primary font-bold' : 'text-grey-medium group-hover:text-primary'
            }`}>
              {range.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="w-full bg-white animate-fadeIn">
      {/* Mobile Controls */}
      <div className="flex items-center gap-4 md:hidden mb-10">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex-1 flex items-center justify-between px-6 py-4 border border-ivory text-primary active:bg-ivory transition-all"
        >
          <div className="flex items-center gap-3">
            <Bars3BottomLeftIcon className="w-5 h-5 text-secondary" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Filters</span>
          </div>
          <span className="text-[10px] text-grey-medium">({filteredSarees.length})</span>
        </button>

        <div className="relative flex-1 group">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full border border-ivory px-6 py-4 text-[10px] uppercase tracking-[0.2em] font-bold text-primary appearance-none outline-none bg-white"
          >
            <option value="relevance">Relevance</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
          <ChevronDownIcon className="w-4 h-4 absolute right-5 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-12 lg:gap-16">
        {/* Simple Desktop Sidebar */}
        <aside className="hidden md:block md:col-span-1 border-r border-ivory/30 pr-8">
          <div className="sticky top-40">
            {renderPriceFilters()}
            
            <div className="mt-12 pt-8 border-t border-ivory/50">
              <p className="text-[9px] uppercase tracking-[0.2em] text-grey-medium font-medium leading-relaxed italic opacity-70">
                Displaying pieces from the curated {category} collection.
              </p>
            </div>
          </div>
        </aside>

        {/* Main Product Display Area */}
        <section className="md:col-span-3 lg:col-span-4">
          {/* Summary Bar */}
          <div className="hidden md:flex justify-between items-center mb-8 pb-4 border-b border-ivory/30">
            <p className="text-[10px] uppercase tracking-[0.15em] text-grey-medium font-medium">
              Showing {filteredSarees.length} products
            </p>
            
            <div className="flex items-center gap-4">
              <span className="text-[10px] uppercase tracking-[0.1em] text-grey-medium font-bold">Sort By</span>
              <div className="relative group min-w-[140px]">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full bg-transparent text-[10px] uppercase tracking-[0.15em] font-bold text-primary py-1 pr-8 border-none focus:ring-0 cursor-pointer appearance-none outline-none"
                >
                  <option value="relevance">Relevance</option>
                  <option value="low-high">Price: Low to High</option>
                  <option value="high-low">Price: High to Low</option>
                </select>
                <ChevronDownIcon className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 text-secondary pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-10">
            {filteredSarees.length > 0 ? (
              filteredSarees.map((saree) => (
                <div key={saree._id}>
                  <SareeCard saree={saree} />
                </div>
              ))
            ) : (
              <div className="col-span-full py-24 flex flex-col items-center">
                <p className="font-main italic text-grey-medium mb-6">
                  No products found in this price range.
                </p>
                <button 
                  onClick={() => setActiveRange(PRICE_RANGES[0])}
                  className="text-[10px] uppercase tracking-[0.2em] text-primary font-bold border-b border-primary hover:text-secondary hover:border-secondary transition-all"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Simplified Mobile Drawer */}
      <Transition show={isFilterOpen} as={Fragment}>
        <Dialog onClose={() => setIsFilterOpen(false)} className="relative z-[100] md:hidden">
          <Transition.Child
            as={Fragment}
            enter="transition-opacity ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="transition-transform ease-in-out duration-300"
            enterFrom="translate-y-full"
            enterTo="translate-y-0"
            leave="transition-transform ease-in-out duration-200"
            leaveFrom="translate-y-0"
            leaveTo="translate-y-full"
          >
            <Dialog.Panel className="fixed inset-x-0 bottom-0 max-h-[70vh] bg-white rounded-t-3xl p-8 flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-secondary text-primary tracking-tight uppercase">Filters</h2>
                <button onClick={() => setIsFilterOpen(false)}>
                  <XMarkIcon className="w-6 h-6 text-grey-medium" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto py-2">
                {renderPriceFilters()}
              </div>

              <div className="mt-8 pt-6 border-t border-ivory">
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full bg-primary text-ivory py-4 text-[10px] uppercase tracking-[0.2em] font-bold"
                >
                  View {filteredSarees.length} Results
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </Dialog>
      </Transition>
    </div>
  );
}
