"use client";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import { useState } from "react";

export default function ProductDetailsClient({ saree }) {
  console.log("Received Saree:", saree);
  const { addToCart } = useCart();
  const [showToast, setShowToast] = useState(false); // State for 'Added to Cart' message
  const [showBuyToast, setShowBuyToast] = useState(false); // State for 'Buy Now' message

  const defaultImage = saree.images && saree.images.length > 0 ? saree.images[0]?.url : "/no-image.jpg";
  const [mainImage, setMainImage] = useState(defaultImage);

  // Function to handle adding to cart
  const handleAddToCart = () => {
    addToCart(saree);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };
  
  // Function to handle immediate purchase
  const handleBuyNow = () => {
    // This is where your actual redirect to checkout logic would go.
    console.log("Redirecting to checkout with:", saree.productName);
    setShowBuyToast(true);
    setTimeout(() => {
      setShowBuyToast(false);
    }, 2000);
  };

  if (!saree) return null;

  return (
    <main className="max-w-6xl mx-auto py-12 px-4 md:px-8 bg-white">
      {/* Toast Notification - Added to Cart */}
      {showToast && (
        <div className="fixed top-20 right-5 z-50 bg-green-600 text-white font-semibold px-6 py-3 rounded-xl shadow-xl transform transition-transform duration-300 animate-fadeInOut">
          Product added to cart successfully.
        </div>
      )}

      {/* Toast Notification - Buy Now */}
      {showBuyToast && (
        <div className="fixed top-20 right-5 z-50 bg-blue-600 text-white font-semibold px-6 py-3 rounded-xl shadow-xl transform transition-transform duration-300 animate-fadeInOut">
          Initiating secure checkout...
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
        {/* Image Gallery */}
        <div className="flex flex-col items-center">
          {/* Main Image Container */}
          <div className="w-full max-w-[550px] mb-6 aspect-square relative border border-gray-200 rounded-xl overflow-hidden">
            <Image
              src={mainImage}
              alt={saree.productName}
              fill // Use 'fill' to make it a responsive background image
              sizes="(max-width: 768px) 100vw, 500px" // Optimized for performance
              className="object-cover transition-opacity duration-500 hover:opacity-95" 
            />
          </div>
          
          {/* Thumbnail Gallery */}
          <div className="flex gap-3 overflow-x-auto w-full max-w-[550px] p-2">
            {saree.images && saree.images.length > 0 && saree.images.map((img, index) => (
              <div 
                key={index} 
                className={`relative w-24 h-24 flex-shrink-0 rounded-lg border-2 cursor-pointer transition-all duration-200 
                  ${mainImage === img.url ? 'border-[#B22222] scale-[1.02] shadow-md' : 'border-gray-300 hover:border-gray-500'}`}
                onClick={() => setMainImage(img.url)}
              >
                <Image
                  src={img.url}
                  alt={img.alt || saree.productName}
                  fill // Use 'fill' for responsive thumbnails
                  sizes="96px"
                  className="object-cover rounded-lg"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="p-4 md:p-0">
          <p className="text-sm font-medium text-gray-500 mb-2 uppercase tracking-wider">{saree.category}</p>
          <h1 className="text-5xl font-extrabold text-[#B22222] mb-4 leading-tight">
            {saree.productName}
          </h1>
          <p className="text-gray-700 mb-6 text-lg border-b pb-6">{saree.description}</p>
          
          {/* Price Section */}
          <div className="flex items-baseline gap-4 mb-8">
            <span className="text-4xl font-bold text-gray-900">
              ₹{saree.price.toFixed(2)}
            </span>
            {saree.discountPrice && (
              <span className="text-2xl text-red-500 line-through opacity-70">
                ₹{saree.discountPrice.toFixed(2)}
              </span>
            )}
          </div>

          {/* Product Specifications */}
          <div className="space-y-3 mb-8 text-base text-gray-700 p-4 bg-gray-50 rounded-lg">
            <p>
              <span className="font-semibold text-[#B22222]">Material:</span> {saree.material}
            </p>
            {saree.sizes && (
              <p>
                <span className="font-semibold text-[#B22222]">Sizes:</span>{" "}
                {saree.sizes.join(", ")}
              </p>
            )}
            {saree.colors && (
              <p>
                <span className="font-semibold text-[#B22222]">Colors:</span>{" "}
                {saree.colors.join(", ")}
              </p>
            )}
            <p className="pt-2 text-sm text-gray-500 border-t mt-4">
              <span className="font-medium">Availability:</span>{" "}
              <span className={`font-bold ${saree.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                {saree.stock > 0 ? `${saree.stock} in Stock` : 'Out of Stock'}
              </span>
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 mt-8">
            <button
              onClick={handleAddToCart} 
              disabled={saree.stock === 0}
              className="flex-1 bg-[#B22222] text-white font-extrabold text-lg py-3 px-8 rounded-full transition-all duration-300 shadow-lg shadow-[#B22222]/50 hover:bg-[#8B0000] disabled:bg-gray-400 disabled:shadow-none"
            >
              Add to Cart
            </button>
            <button
              onClick={handleBuyNow} 
              disabled={saree.stock === 0}
              className="flex-1 bg-white text-[#B22222] font-extrabold text-lg py-3 px-8 rounded-full border-2 border-[#B22222] transition-all duration-300 shadow-md hover:bg-[#FEECEB] disabled:bg-gray-100 disabled:text-gray-500 disabled:border-gray-300 disabled:shadow-none"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}