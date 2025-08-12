"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import SlidingBanner from "../../components/SlidingBanner";

export default function HomePage() {
  const [sarees, setSarees] = useState([]);

  useEffect(() => {
    fetch("/api/sarees")
      .then((res) => res.json())
      .then((data) => setSarees(data))
      .catch((err) => console.error("Error fetching sarees:", err));
  }, []);

  return (
    <main>
      <SlidingBanner />

      {/* Best Sellers */}
      <section className="max-w-[1440px] mx-auto pt-16 pb-8 px-4 md:px-8">
        <h2 className="text-3xl font-bold text-center text-[#B22222]">
          BEST SELLERS
        </h2>

        {/* Desktop grid */}
        <div className="grid grid-cols-5 gap-8 hidden md:grid pt-10">
          {sarees.map((saree) => (
            <Link
              key={saree._id}
              href={`/product/${saree._id}`}
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
                <h3 className="text-sm text-center font-bold font-secondary text-gray-700">
                  {saree.productName}
                </h3>
                <p className="text-gray-700 text-sm font-secondary text-center">
                  ₹{saree.price}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile horizontal scroll */}
        <div className="flex overflow-x-auto md:hidden gap-2 pt-10">
          {sarees.map((saree) => (
            <Link
              key={saree._id}
              href={`/product/${saree._id}`}
              className="bg-white hover:shadow-md transition min-w-[130px] overflow-hidden block"
            >
              {saree.imgSrc && (
                <img
                  src={saree.imgSrc}
                  alt={saree.productName}
                  className="w-full object-contain"
                />
              )}
              <div className="p-2">
                <h3 className="text-xs text-center font-bold font-secondary text-gray-700">
                  {saree.productName}
                </h3>
                <p className="text-gray-700 text-xs font-secondary text-center">
                  ₹{saree.price}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* View All button */}
        <div className="text-center mt-6">
          <button
            className="px-4 py-2 font-medium text-gray-500 rounded 
                      ring-1 ring-gray-500 
                      hover:ring-2 
                      transition-all duration-300 ease-in-out"
          >
            View All
          </button>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-[1440px] mx-auto py-8 px-4 md:px-8">
        <h2 className="text-3xl font-bold text-center text-[#B22222]">
          NEW ARRIVALS
        </h2>

        {/* Desktop grid */}
        <div className="grid grid-cols-5 gap-8 hidden md:grid pt-10">
          {sarees.map((saree) => (
            <Link
              key={saree._id}
              href={`/product/${saree._id}`}
              className="bg-white hover:shadow-md transition overflow-hidden relative block"
            >
              {saree.imgSrc && (
                <img
                  src={saree.imgSrc}
                  alt={saree.productName}
                  className="w-full object-contain"
                />
              )}
              {/* New Tag */}
              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-secondary font-bold px-2 py-1">
                New
              </div>
              <div className="p-4">
                <h3 className="text-sm text-center font-bold font-secondary text-gray-700">
                  {saree.productName}
                </h3>
                <p className="text-gray-700 text-sm font-secondary text-center">
                  ₹{saree.price}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Mobile horizontal scroll */}
        <div className="flex overflow-x-auto md:hidden gap-2 pt-10">
          {sarees.map((saree) => (
            <Link
              key={saree._id}
              href={`/product/${saree._id}`}
              className="bg-white hover:shadow-md transition min-w-[130px] overflow-hidden relative block"
            >
              {saree.imgSrc && (
                <img
                  src={saree.imgSrc}
                  alt={saree.productName}
                  className="w-full object-contain"
                />
              )}
              <div className="absolute top-0 right-0 bg-red-500 text-white text-xs font-secondary font-bold px-2 py-1">
                New
              </div>
              <div className="p-2">
                <h3 className="text-xs text-center font-bold font-secondary text-gray-700">
                  {saree.productName}
                </h3>
                <p className="text-gray-700 text-xs font-secondary text-center">
                  ₹{saree.price}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* View All button */}
        <div className="text-center mt-6">
          <button
            className="px-4 py-2 font-medium text-gray-500 rounded 
                      ring-1 ring-gray-500 
                      hover:ring-2 
                      transition-all duration-300 ease-in-out"
          >
            View All
          </button>
        </div>
      </section>
    </main>
  );
}
