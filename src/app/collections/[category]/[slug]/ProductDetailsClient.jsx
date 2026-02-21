"use client";
import { useState } from "react";
import { useCart } from "@/app/context/CartContext";
import { useWishlist } from "@/app/context/WishlistContext";
import Image from "next/image";
import { Heart, Check, ShoppingBag, ArrowRight } from 'lucide-react';
import SareeCard from "../../../../../components/SareeCard";
import Link from "next/link";

export default function ProductDetailsClient({ saree, relatedSarees }) {
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist(); 
  const [showBuyToast, setShowBuyToast] = useState(false);

  const defaultImage = saree.images && saree.images.length > 0 ? saree.images[0]?.url : "/no-image.jpg";
  const [mainImage, setMainImage] = useState(defaultImage);

  const handleAddToCart = () => {
    addToCart(saree);
    setIsCartAckOpen(true);
  };
  
  const handleBuyNow = () => {
    console.log("Redirecting to checkout with:", saree.productName);
    setShowBuyToast(true);
    setTimeout(() => setShowBuyToast(false), 2000);
  };

  const handleAddToWishlist = () => {
    addToWishlist(saree);
    alert("Added to Wishlist!");
  };

  if (!saree) return null;

  return (
    <>
      <main className="max-w-6xl mx-auto py-8 md:py-12 px-6 bg-white font-main">
        {showBuyToast && (
          <div className="fixed top-24 right-5 z-50 bg-black text-white font-medium px-6 py-3 shadow-premium animate-fadeInOut flex items-center gap-3 text-sm">
             <ShoppingBag size={18} />
             <span>Preparing your luxury checkout...</span>
          </div>
        )}
        
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[9px] uppercase tracking-[0.2em] text-grey-medium mb-6">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <span className="text-secondary/50">/</span>
          <Link href={`/collections/${saree.category}`} className="hover:text-primary transition-colors">{saree.category}</Link>
          <span className="text-secondary/50">/</span>
          <span className="text-secondary">{saree.productName}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-14">
          {/* Image Gallery */}
          <div className="flex flex-col-reverse md:flex-row gap-4">
            {/* Thumbnails */}
            <div className="flex flex-row md:flex-col gap-3 overflow-x-auto md:overflow-y-auto no-scrollbar md:max-h-[500px]">
              {saree.images && saree.images.map((img, index) => (
                <button 
                  key={index} 
                  className={`relative w-16 h-20 md:w-20 md:h-28 flex-shrink-0 border transition-all duration-300 ${mainImage === img.url ? 'border-secondary' : 'border-gray-100 hover:border-secondary/30'}`}
                  onClick={() => setMainImage(img.url)}
                >
                  <Image src={img.url} alt={img.alt || saree.productName} fill className="object-cover" sizes="80px" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 relative aspect-[3/4] border border-ivory/50 overflow-hidden silk-bg group max-w-[500px]">
               <Image 
                  src={mainImage} 
                  alt={saree.productName} 
                  fill 
                  priority
                  sizes="(max-width: 1024px) 100vw, 500px" 
                  className="object-cover transition-transform duration-1000 group-hover:scale-105" 
               />
               <div className="absolute inset-0 border-[8px] border-white/5 pointer-events-none"></div>
               <div className="absolute inset-3 border border-white/20 pointer-events-none"></div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col pt-2 max-w-lg">
            <div className="inline-block px-2 py-0.5 bg-ivory text-primary text-[9px] font-bold tracking-[0.2em] uppercase w-fit mb-4">
              {saree.category.replace("-", " ")}
            </div>
            
            <h1 className="text-2xl md:text-3xl font-secondary text-primary mb-3 leading-tight">
              {saree.productName}
            </h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-bold text-grey-dark">₹{saree.discountPrice.toLocaleString()}</span>
                {saree.price > saree.discountPrice && (
                  <span className="text-xs text-grey-medium line-through opacity-60 italic">₹{saree.price.toLocaleString()}</span>
                )}
              </div>
              {saree.price > saree.discountPrice && (
                <div className="px-2 py-0.5 border border-secondary text-secondary text-[9px] font-bold tracking-widest uppercase">
                  {Math.round(((saree.price - saree.discountPrice) / saree.price) * 100)}% OFF
                </div>
              )}
            </div>

            <p className="text-grey-medium leading-relaxed mb-8 text-sm border-l-2 border-secondary/20 pl-4 italic">
              {saree.description}
            </p>

            <div className="bg-grey-light p-4 mb-8 text-[11px] flex flex-col gap-2">
              <div className="flex justify-between border-b border-white pb-2">
                <span className="uppercase tracking-widest text-grey-medium">Artisinal Material</span>
                <span className="font-bold text-grey-dark uppercase">{saree.material || "Pure Silk"}</span>
              </div>
              <div className="flex justify-between border-b border-white pb-2">
                <span className="uppercase tracking-widest text-grey-medium">Availability</span>
                <span className={`font-bold transition-colors ${saree.stock > 0 ? 'text-accent' : 'text-primary'}`}>
                  {saree.stock > 0 ? `IN STOCK (${saree.stock})` : 'EXCLUSIVELY SOLDOUT'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="uppercase tracking-widest text-grey-medium">Shipping</span>
                <span className="font-bold text-grey-dark">Complimentary Express</span>
              </div>
            </div>

            <div className="flex gap-3 mt-auto mb-4">
              <button 
                onClick={handleAddToCart} 
                disabled={saree.stock === 0} 
                className="btn-primary flex-1 py-3.5 flex items-center justify-center gap-2 group text-xs"
              >
                <ShoppingBag size={16} className="translate-y-[-1px] transition-transform group-hover:scale-110" />
                Add to Cart
              </button>
              <button 
                onClick={handleAddToWishlist} 
                className="w-14 h-12 border-2 border-primary flex items-center justify-center text-primary transition-all duration-300 hover:bg-primary hover:text-white"
                title="Add to Wishlist"
              >
                <Heart size={18} className="fill-current" />
              </button>
            </div>
            
            <button 
              onClick={handleBuyNow} 
              disabled={saree.stock === 0} 
              className="btn-outline w-full py-3.5 flex items-center justify-center gap-2 transition-colors hover:bg-black hover:border-black text-xs"
            >
              Express Boutique Checkout
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Traditional Divider */}
        <div className="flex items-center justify-center gap-4 py-16 opacity-30">
          <div className="h-[1px] w-24 bg-secondary"></div>
          <div className="w-2.5 h-2.5 rotate-45 border border-secondary"></div>
          <div className="h-[1px] w-24 bg-secondary"></div>
        </div>

        {/* Related Products Section */}
        {relatedSarees && relatedSarees.length > 0 && (
          <section className="mt-4">
             <div className="flex flex-col items-center mb-8">
                <div className="w-8 h-0.5 bg-secondary/30 mb-2"></div>
                <h2 className="text-xl md:text-2xl font-secondary text-center text-primary tracking-tight uppercase">
                  Complete Your Look
                </h2>
                <p className="text-[9px] uppercase tracking-[0.3em] text-grey-medium mt-2">Curated recommendations just for you</p>
                <div className="flex items-center gap-2 mt-3">
                  <div className="h-[1px] w-10 bg-secondary/40"></div>
                  <div className="w-1.5 h-1.5 rotate-45 border border-secondary/50"></div>
                  <div className="h-[1px] w-10 bg-secondary/40"></div>
                </div>
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {relatedSarees.map((related) => (
                  <SareeCard key={related._id} saree={related} />
                ))}
             </div>
          </section>
        )}
      </main>
    </>
  );
}
