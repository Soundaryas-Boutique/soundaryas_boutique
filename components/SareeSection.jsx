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
    <section className={`${bg || "bg-white"} py-10 lg:py-16`}>
      <div className="max-w-[1440px] mx-auto px-6 md:px-12">
        
        {/* Decorative Header */}
        <div className="flex flex-col items-center mb-8 lg:mb-10">
          <div className="w-10 h-0.5 bg-secondary/30 mb-3"></div>
          <h2 className="text-2xl md:text-3xl lg:text-3xl font-secondary text-center text-primary tracking-tight uppercase">
            {title}
          </h2>
          <div className="flex items-center gap-3 mt-3">
            <div className="h-[1px] w-8 lg:w-16 bg-secondary/40"></div>
            <div className="w-2 h-2 rotate-45 border border-secondary/50"></div>
            <div className="h-[1px] w-8 lg:w-16 bg-secondary/40"></div>
          </div>
        </div>

        {/* Desktop Grid - Narrower Gaps */}
        <div className="hidden md:grid grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
          {sarees.map((saree) => (
            <SareeCard key={saree._id} saree={saree} variant="desktop" />
          ))}
        </div>

        {/* Mobile Horizontal Scroll - Smaller Cards */}
        <div className="flex overflow-x-auto md:hidden gap-3 pb-6 no-scrollbar -mx-6 px-6">
          {sarees.map((saree) => (
            <div key={saree._id} className="min-w-[170px]">
              <SareeCard saree={saree} variant="mobile" />
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className="text-center mt-8 lg:mt-10">
          <Link
            href={viewAllLink}
            className="btn-outline inline-block px-10 py-2.5 text-xs"
          >
            Explore Collection
          </Link>
        </div>
      </div>
    </section>
  );
}
