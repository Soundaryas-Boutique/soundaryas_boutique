"use client";

import Link from "next/link";
import { AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";

export default function SareeCard({ saree, variant = "desktop" }) {
  const href = `/collections/${saree.category}/${encodeURIComponent(
    saree.slug.toLowerCase().replace(/\s+/g, "-")
  )}`;

  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist(); 

  const handleAddToCart = () => addToCart(saree);
  const handleAddToWishlist = () => addToWishlist(saree);

  const isMobile = variant === "mobile";

  const containerClasses = isMobile
    ? "relative min-w-[130px] overflow-hidden transition group"
    : "relative overflow-hidden transition group";

  const textSize = isMobile ? "text-xs" : "text-sm";
  const padding = isMobile ? "p-2" : "p-4";

  const hasOffer = saree.discountPrice && saree.discountPrice < saree.price;
  const discountPercentage = hasOffer
    ? Math.round(((saree.price - saree.discountPrice) / saree.price) * 100)
    : 0;

  return (
    <div className={containerClasses}>
      {/* Image + Product Info inside Link */}
      <Link href={href} className="block">
        <div className="relative overflow-hidden">
          {/* Product image container with fixed height */}
          <div className={`w-full overflow-hidden relative`}>
            {saree.images && saree.images[0] ? (
              <img
                src={saree.images[0].url}
                alt={saree.images[0].alt || saree.productName}
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex items-center justify-center bg-grey-light text-grey-dark w-full h-full">
                No Image
              </div>
            )}
          </div>

          {/* Product info */}
          <div className={padding}>
            <h3 className={`${textSize} text-center font-bold font-heading text-grey-dark truncate`}>
              {saree.productName}
            </h3>

            <div className="flex justify-center items-center gap-2 mt-1">
              {hasOffer ? (
                <>
                  <span className={`${textSize} text-grey-dark line-through`}>
                    ₹{saree.price}
                  </span>
                  <span className={`${textSize} text-primary font-bold`}>
                    ₹{saree.discountPrice}
                  </span>
                  <span className="bg-red-600 text-white text-[10px] font-bold px-1 py-0.5 rounded">
                    -{discountPercentage}%
                  </span>
                </>
              ) : (
                <span className={`${textSize} text-grey-dark font-bold`}>
                  ₹{saree.price}
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Overlay buttons outside Link but visually over image */}
      <div className="absolute bottom-22 left-1/2 transform -translate-x-1/2 flex gap-2 bg-white rounded-full p-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button
          className="p-1 hover:bg-red-50 rounded-full cursor-pointer"
          onClick={handleAddToWishlist}
        >
          <AiOutlineHeart className="text-red-600 w-4 h-4" />
        </button>

        <button
          className="p-1 hover:bg-green-50 rounded-full cursor-pointer"
          onClick={handleAddToCart}
        >
          <AiOutlineShoppingCart className="text-green-600 w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
