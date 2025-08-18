"use client";
import { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const ProductPage = ({ product }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  if (!product) return <p className="p-8">Loading...</p>;

  const images = product.images || [product.imgSrc]; // fallback to main image

  const changeImage = (direction) => {
    const newIndex =
      direction === "up"
        ? (selectedIndex - 1 + images.length) % images.length
        : (selectedIndex + 1) % images.length;

    setSelectedIndex(newIndex);
  };

  return (
    <div className="bg-white">
      <div className="flex max-w-[1440px] mx-auto min-h-screen">
        {/* Left Side - Thumbnails + Main Image */}
        <div className="w-1/2 p-6 flex gap-4 sticky top-10 h-fit">
          <div className="flex flex-col items-center gap-2">
            <button
              onClick={() => changeImage("up")}
              className="text-gray-500 hover:text-[#B22222] transition"
            >
              <ChevronUp size={24} />
            </button>

            <div className="flex flex-col gap-4 overflow-y-auto max-h-[500px] no-scrollbar">
              {images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className={`w-[120px] h-[170px] object-contain rounded cursor-pointer border-2 ${
                    selectedIndex === idx
                      ? "border-[#B22222]"
                      : "border-transparent"
                  }`}
                  onClick={() => setSelectedIndex(idx)}
                />
              ))}
            </div>

            <button
              onClick={() => changeImage("down")}
              className="text-gray-500 hover:text-[#B22222] transition"
            >
              <ChevronDown size={24} />
            </button>
          </div>

          <div className="flex-1">
            <img
              src={images[selectedIndex]}
              alt={product.productName}
              className="w-full max-w-[600px] h-auto object-contain rounded-lg"
            />
          </div>
        </div>

        {/* Right Side - Product Info */}
        <div className="w-1/2 p-6 space-y-12">
          <section className="space-y-6">
            <h1 className="text-3xl font-bold text-[#B22222]">
              {product.productName}
            </h1>
            <p className="text-gray-700 text-lg">{product.description}</p>
            <p className="text-2xl font-semibold text-[#B22222]">
              ₹{product.price}
            </p>

            <button className="bg-[#B22222] text-white px-6 py-2 rounded hover:bg-[#a11d1d] transition">
              Add to Cart
            </button>
          </section>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
