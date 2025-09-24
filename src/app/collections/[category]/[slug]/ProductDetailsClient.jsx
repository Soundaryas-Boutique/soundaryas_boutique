"use client";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import { useState } from "react";

export default function ProductDetailsClient({ saree }) {
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false); // New state for the message

  const defaultImage = saree.images && saree.images.length > 0 ? saree.images[0]?.url : "/no-image.jpg";
  const [mainImage, setMainImage] = useState(defaultImage);

  // This function now handles both adding to cart and showing the message
  const handleAddToCart = () => {
    addToCart(saree);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000); // Hide the toast after 2 seconds
  };

  if (!saree) return null;

  return (
    <main className="max-w-[1440px] mx-auto py-8 px-4 md:px-8">
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-20 right-5 z-50 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg transform transition-transform duration-300 animate-fadeInOut">
          Product added to cart! ✅
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="flex flex-col items-center">
          <div className="w-full max-w-[500px] mb-4">
            <Image
              src={mainImage}
              alt={saree.productName}
              width={500}
              height={500}
              className="w-full rounded-lg shadow-lg"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto w-full max-w-[500px]">
            {saree.images && saree.images.length > 0 && saree.images.map((img, index) => (
              <Image
                key={index}
                src={img.url}
                alt={img.alt || saree.productName}
                width={80}
                height={80}
                className="rounded-lg border-2 border-transparent hover:border-[#B22222] cursor-pointer transition-colors"
                onClick={() => setMainImage(img.url)}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4">
          <h1 className="text-4xl font-bold text-[#B22222] mb-2">
            {saree.productName}
          </h1>
          <p className="text-gray-600 mb-4">{saree.description}</p>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-3xl font-semibold text-gray-800">
              ₹{saree.price.toFixed(2)}
            </span>
            {saree.discountPrice && (
              <span className="text-xl text-gray-400 line-through">
                ₹{saree.discountPrice.toFixed(2)}
              </span>
            )}
          </div>

          <div className="space-y-2 mb-6 text-sm text-gray-600">
            <p>
              <span className="font-semibold">Category:</span> {saree.category}
            </p>
            <p>
              <span className="font-semibold">Material:</span> {saree.material}
            </p>
            {saree.sizes && (
              <p>
                <span className="font-semibold">Sizes:</span>{" "}
                {saree.sizes.join(", ")}
              </p>
            )}
            {saree.colors && (
              <p>
                <span className="font-semibold">Colors:</span>{" "}
                {saree.colors.join(", ")}
              </p>
            )}
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleAddToCart} // Call the new handler function
              className="bg-[#B22222] text-white font-bold py-3 px-8 rounded-full transition-colors hover:bg-[#8B0000]"
            >
              Add to Cart
            </button>
            <span className="text-gray-500 font-medium">
              Stock: {saree.stock}
            </span>
          </div>
        </div>
      </div>
    </main>
  );
}