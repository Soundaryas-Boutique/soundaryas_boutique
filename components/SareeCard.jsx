"use client";

import Link from "next/link";
import { AiOutlineHeart, AiOutlineShoppingCart } from "react-icons/ai";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";

export default function SareeCard({ saree, variant = "desktop" }) {
  const href = `/collections/${saree.category}/${encodeURIComponent(
    saree.slug?.toLowerCase().replace(/\s+/g, "-") || ""
  )}`;

  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist(); 

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(saree);
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(saree);
  };

  const isMobile = variant === "mobile";
  const hasOffer = saree.discountPrice && saree.discountPrice < saree.price;
  const discountPercentage = hasOffer
    ? Math.round(((saree.price - saree.discountPrice) / saree.price) * 100)
    : 0;

  return (
    <div className={`group relative bg-white transition-all duration-500 hover:shadow-premium flex flex-col h-full border border-transparent hover:border-ivory/50`}>
      {/* Product Image Wrapper */}
      <Link href={href} className="relative block overflow-hidden aspect-[3/4]">
        {saree.images && saree.images[0] ? (
          <img
            src={saree.images[0].url}
            alt={saree.images[0].alt || saree.productName}
            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-ivory/20 flex items-center justify-center">
            <span className="text-[9px] uppercase tracking-widest text-grey-medium">Boutique</span>
          </div>
        )}

        {/* Traditional Border Hover Effect */}
        <div className="absolute inset-0 border-[8px] lg:border-[12px] border-white/0 group-hover:border-white/10 transition-all duration-700 pointer-events-none"></div>
        <div className="absolute inset-2 lg:inset-3 border border-white/0 group-hover:border-white/30 transition-all duration-700 pointer-events-none"></div>

        {/* Sale Tag */}
        {hasOffer && (
          <div className="absolute top-2 left-2 lg:top-4 lg:left-4 bg-primary text-ivory text-[8px] lg:text-[9px] font-bold px-2 py-1 shadow-sm">
            <span className="uppercase tracking-widest">{discountPercentage}% OFF</span>
          </div>
        )}

        {/* Quick Actions Overlay (Hidden on Mobile for cleaner look, or smaller) */}
        {!isMobile && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500">
            <button
              onClick={handleAddToWishlist}
              className="w-9 h-9 rounded-full bg-white/95 hover:bg-secondary hover:text-white text-primary flex items-center justify-center shadow-lg transition-colors"
            >
              <AiOutlineHeart className="w-4 h-4" />
            </button>
            <button
              onClick={handleAddToCart}
              className="w-9 h-9 rounded-full bg-white/95 hover:bg-primary hover:text-white text-secondary flex items-center justify-center shadow-lg transition-colors"
            >
              <AiOutlineShoppingCart className="w-4 h-4" />
            </button>
          </div>
        )}
      </Link>

      {/* Product Information */}
      <div className={`${isMobile ? 'p-2.5' : 'p-4'} flex flex-col items-center flex-1`}>
        <h3 className={`${isMobile ? 'text-[10px]' : 'text-xs'} font-secondary text-primary tracking-wide text-center mb-1 line-clamp-1 group-hover:text-secondary transition-colors uppercase`}>
          {saree.productName}
        </h3>
        
        <div className="mt-auto flex items-center gap-2">
          {hasOffer ? (
            <>
              <span className={`${isMobile ? 'text-[9px]' : 'text-[10px]'} text-grey-medium line-through font-main opacity-60`}>₹{saree.price}</span>
              <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-primary font-bold font-main tracking-tight`}>₹{saree.discountPrice}</span>
            </>
          ) : (
            <span className={`${isMobile ? 'text-[10px]' : 'text-xs'} text-primary font-bold font-main tracking-tight`}>₹{saree.price}</span>
          )}
        </div>
      </div>
    </div>
  );
}
