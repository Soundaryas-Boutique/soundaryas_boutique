"use client";

import Link from "next/link";
import SlidingBanner from "../../components/SlidingBanner";

export default function HomePage({ sarees }) {
  return (
    <main>
      <SlidingBanner />

      {/* Best Sellers */}
      <section className="max-w-[1440px] mx-auto pt-16 pb-8 px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#B22222]">
          BEST SELLERS
        </h2>

        {/* Desktop grid */}
        <div className="grid grid-cols-5 gap-8 hidden md:grid pt-6">
          {sarees.map((saree) => (
            <Link
              key={saree._id}
              href={`/collections/${saree.category}/${encodeURIComponent(
                saree.slug.toLowerCase().replace(/\s+/g, "-")
              )}`}
              className="bg-white hover:shadow-md transition overflow-hidden block"
            >
              {saree.images && saree.images[0] ? (
                <img
                  src={saree.images[0].url}
                  alt={saree.images[0].alt || saree.productName}
                  className="w-full object-contain"
                />
              ) : (
                "No Image"
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
        <div className="flex overflow-x-auto md:hidden gap-2 pt-6">
          {sarees.map((saree) => (
            <Link
              key={saree._id}
              href={`/collections/${saree.category}/${encodeURIComponent(
                saree.slug.toLowerCase().replace(/\s+/g, "-")
              )}`}
              className="bg-white hover:shadow-md transition min-w-[130px] overflow-hidden block"
            >
              {saree.images && saree.images[0] ? (
                <img
                  src={saree.images[0].url}
                  alt={saree.images[0].alt || saree.productName}
                  className="w-full object-contain"
                />
              ) : (
                "No Image"
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
          <Link
            href="/collections/new-arrivals"
            className="font-secondary 
                      px-2 py-1 text-sm
                      sm:px-4 sm:py-1 sm:text-base 
                      text-gray-500 rounded 
                      ring-1 ring-gray-500 
                      hover:ring-2 
                      transition-all duration-300 ease-in-out"
          >
            VIEW ALL
          </Link>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="max-w-[1440px] mx-auto py-8 px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-bold text-center text-[#B22222]">
          NEW ARRIVALS
        </h2>

        <div className="grid grid-cols-5 gap-8 hidden md:grid pt-6">
          {sarees.map((saree) => (
            <Link
              key={saree._id}
              href={`/collections/${saree.category}/${encodeURIComponent(
                saree.slug.toLowerCase().replace(/\s+/g, "-")
              )}`}
              className="bg-white hover:shadow-md transition overflow-hidden relative block"
            >
              {saree.images && saree.images[0] ? (
                <img
                  src={saree.images[0].url}
                  alt={saree.images[0].alt || saree.productName}
                  className="w-full object-contain"
                />
              ) : (
                "No Image"
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
        <div className="flex overflow-x-auto md:hidden gap-2 pt-6">
          {sarees.map((saree) => (
            <Link
              key={saree._id}
              href={`/collections/${saree.category}/${encodeURIComponent(
                saree.slug.toLowerCase().replace(/\s+/g, "-")
              )}`}
              className="bg-white hover:shadow-md transition min-w-[130px] overflow-hidden relative block"
            >
              {saree.images && saree.images[0] ? (
                <img
                  src={saree.images[0].url}
                  alt={saree.images[0].alt || saree.productName}
                  className="w-full object-contain"
                />
              ) : (
                "No Image"
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
          <Link
            href="/collections/new-arrivals"
            className="font-secondary 
                      px-2 py-1 text-sm
                      sm:px-4 sm:py-1 sm:text-base 
                      text-gray-500 rounded 
                      ring-1 ring-gray-500 
                      hover:ring-2 
                      transition-all duration-300 ease-in-out"
          >
            VIEW ALL
          </Link>
        </div>
      </section>

      {/* Leave a Review Section */}
      <section className="bg-white py-12 text-center">
        <h2 className="text-2xl font-bold text-[#B22222] mb-4">
          Share Your Experience
        </h2>
        <p className="text-gray-600 mb-6 max-w-xl mx-auto">
          Loved your experience with Soundarya&apos;s Boutique? We&apos;d love
          to hear from you! Your feedback helps us grow.
        </p>
        <Link
          href="/review-page"
          className="bg-[#A52A2A] text-white font-medium py-3 px-8 rounded-md hover:bg-[#8B0000] transition-colors duration-200"
        >
          Leave a Review
        </Link>

      </section>
    </main>
  );
}
