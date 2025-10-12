"use client";

import Link from "next/link";

export default function SareeCard({ saree, variant = "desktop" }) {
  const href = `/collections/${saree.category}/${encodeURIComponent(
    saree.slug.toLowerCase().replace(/\s+/g, "-")
  )}`;

  // Adjust sizing & padding for mobile vs desktop
  const isMobile = variant === "mobile";
  const containerClasses = isMobile
    ? "min-w-[130px] bg-white hover:shadow-md transition overflow-hidden block"
    : "bg-white hover:shadow-md transition overflow-hidden block";

  const textSize = isMobile ? "text-xs" : "text-sm";
  const padding = isMobile ? "p-2" : "p-4";

  return (
    <Link href={href} className={containerClasses}>
      {saree.images && saree.images[0] ? (
        <img
          src={saree.images[0].url}
          alt={saree.images[0].alt || saree.productName}
          className="w-full object-contain"
        />
      ) : (
        <div className="flex items-center justify-center h-48 bg-grey-light text-grey-dark">
          No Image
        </div>
      )}

      <div className={padding}>
        <h3 className={`${textSize} text-center font-bold font-heading text-grey-dark`}>
          {saree.productName}
        </h3>
        <p className={`${textSize} text-grey-dark font-main text-center`}>
          ₹{saree.price}
        </p>
      </div>
    </Link>
  );
}
