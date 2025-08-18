"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ProductsPage() {
  const { category } = useParams(); // get category from URL
  const [sarees, setSarees] = useState([]);

  useEffect(() => {
    if (!category) return;
    const fetchSarees = async () => {
      const res = await fetch(`/api/sarees/category/${category}`);
      const data = await res.json();
      setSarees(data);
    };
    fetchSarees();
  }, [category]);

  return (
    <main className="max-w-[1440px] mx-auto py-8 px-4 md:px-8">
      <h2 className="text-3xl font-bold text-center text-[#B22222] uppercase">
        {category ? category.replace("-", " ") : "Loading..."}
      </h2>

      {/* Grid Display */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 pt-10">
        {sarees.length > 0 ? (
          sarees.map((saree) => (
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
                <h3 className="text-sm text-center font-bold font-secondary text-gray-700">
                  {saree.productName}
                </h3>
                <p className="text-gray-700 text-sm font-secondary text-center">
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
    </main>
  );
}
