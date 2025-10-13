"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import SareeCard from "./SareeCard";

export default function SareeSection({ title, viewAllLink, initialData, bg }) {
  const [sarees, setSarees] = useState(initialData);

  // Fetch fresh data on client-side
  useEffect(() => {
    async function fetchFresh() {
      try {
        const res = await fetch("/api/homepage");
        const data = await res.json();
        if (title === "BEST SELLERS") setSarees(data.bestSellers);
        else setSarees(data.newArrivals);
      } catch (err) {
        console.error(err);
      }
    }
    fetchFresh();
  }, [title]);

  return (
    // Only this section gets the background
    <section className={`${bg || ""} py-8`}>
      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        <h2 className="text-2xl md:text-3xl font-light text-center text-grey-dark font-secondary">
          {title}
        </h2>

        {/* Desktop grid */}
        <div className="grid grid-cols-5 gap-8 hidden md:grid pt-6">
          {sarees.map((saree) => (
            <SareeCard key={saree._id} saree={saree} variant="desktop" />
          ))}
        </div>

        {/* Mobile horizontal scroll */}
        <div className="flex overflow-x-auto md:hidden gap-2 pt-6">
          {sarees.map((saree) => (
            <SareeCard key={saree._id} saree={saree} variant="mobile" />
          ))}
        </div>

        {/* View All button */}
        <div className="text-center mt-6">
          <Link
            href={viewAllLink}
            className="font-main px-2 py-1 text-sm sm:px-4 sm:py-1 sm:text-base text-gray-500 rounded ring-1 ring-gray-500 hover:ring-2 transition-all duration-300 ease-in-out"
          >
            VIEW ALL
          </Link>
        </div>
      </div>
    </section>
  );
}
