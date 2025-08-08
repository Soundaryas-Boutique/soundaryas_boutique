"use client";
import { useRef, useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const ProductPage = () => {
  const images = [
    "/sample_product_images/picture1.webp",
    "/sample_product_images/picture2.webp",
    "/sample_product_images/picture3.webp",
    "/sample_product_images/picture2.webp",
    "/sample_product_images/picture2.webp", 
  ];

  const [selectedIndex, setSelectedIndex] = useState(0);

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
          {/* Thumbnail Bar with Arrows */}
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

          {/* Main Image */}
          <div className="flex-1">
            <img
              src={images[selectedIndex]}
              alt="Selected Product"
              className="w-full max-w-[600px] h-auto object-contain rounded-lg"
            />
          </div>
        </div>

        {/* Right Side - Product Info */}
        <div className="w-1/2 p-6 space-y-12">
          <section className="space-y-6">
            <h1 className="text-3xl font-bold text-[#B22222]">
              Handwoven Banarasi Saree
            </h1>
            <p className="text-gray-700 text-lg">
              This beautiful handwoven saree is made with traditional techniques
              from Varanasi. Crafted with care and precision, perfect for
              weddings and special occasions.
            </p>
            <p className="text-2xl font-semibold text-[#B22222]">₹12,999</p>

            <button className="bg-[#B22222] text-white px-6 py-2 rounded hover:bg-[#a11d1d] transition">
              Add to Cart
            </button>

            <div>
              <h2 className="text-xl font-semibold">Product Details</h2>
              <ul className="list-disc list-inside text-gray-700 mt-2 space-y-1">
                <li>Fabric: Silk Blend</li>
                <li>Length: 5.5 meters</li>
                <li>Blouse Piece Included</li>
                <li>Wash Care: Dry Clean Only</li>
              </ul>
            </div>
          </section>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="max-w-[1440px] mx-auto px-6 py-12">
        <h2 className="text-2xl font-bold mb-6 text-[#B22222]">
          Related Products
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="border p-4 rounded shadow hover:shadow-md transition"
            >
              <img
                src={`/related${item}.jpg`}
                alt="Related Product"
                className="w-full h-48 object-cover rounded"
              />
              <h3 className="mt-2 text-lg font-semibold">
                Related Saree {item}
              </h3>
              <p className="text-[#B22222] font-semibold">₹8,999</p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#FAF3EB] py-8 mt-10 border-t">
        <div className="max-w-[1440px] mx-auto text-center text-gray-600">
          &copy; 2025 Soundarya’s Boutique. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

export default ProductPage;
