"use client";

import { useWishlist } from "@/app/context/WishlistContext";
import Image from "next/image";
import Link from "next/link";
import { FaTrashAlt } from "react-icons/fa";
import { useSession } from "next-auth/react";

export default function WishlistPage() {
  const { data: session } = useSession();
  const { wishlistItems, removeFromWishlist, addToCart } = useWishlist();

  // Handle moving item to cart
  const handleMoveToCart = async (itemId) => {
    if (!session) {
      alert("Please sign in to move items to cart.");
      return;
    }

    try {
      // Assuming your backend logic to add to cart is set
      const response = await fetch(`/api/cart/${itemId}`, { method: "POST" });
      if (response.ok) {
        // After adding to cart, remove from wishlist
        removeFromWishlist(itemId);
      } else {
        alert("Failed to add item to cart.");
      }
    } catch (error) {
      console.error("Error adding item to cart:", error);
      alert("An error occurred. Please try again.");
    }
  };

  // Handle removing item from wishlist
  const handleRemove = (id) => {
    removeFromWishlist(id);
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white">
        <div className="w-16 h-0.5 bg-secondary/30 mb-6"></div>
        <h1 className="text-3xl md:text-4xl font-secondary text-primary mb-6 tracking-tight uppercase">
          Your Wishlist is Empty
        </h1>
        <p className="text-grey-medium font-main mb-10 max-w-md mx-auto italic">
          "The heart knows what it desires before the eyes even see. Let's find that one piece that captures yours."
        </p>
        <Link
          href="/collections"
          className="btn-outline inline-block px-12"
        >
          Explore Collection
        </Link>
        <div className="w-16 h-px bg-secondary/20 mt-12"></div>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto py-12 lg:py-20 px-6 md:px-12 bg-white">
      {/* Decorative Header */}
      <div className="flex flex-col items-center mb-12 lg:mb-16">
        <div className="w-10 h-0.5 bg-secondary/30 mb-4"></div>
        <h1 className="text-3xl md:text-5xl font-secondary text-center text-primary tracking-tight uppercase">
          My Wishlist
        </h1>
        <div className="flex items-center gap-4 mt-6">
          <div className="h-[1px] w-12 lg:w-20 bg-secondary/40"></div>
          <div className="w-2.5 h-2.5 rotate-45 border border-secondary/50"></div>
          <div className="h-[1px] w-12 lg:w-20 bg-secondary/40"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        {/* Wishlist Items List */}
        <div className="lg:col-span-2 space-y-6">
          {wishlistItems.map((item) => (
            <div
              key={item._id}
              className="group flex flex-col sm:flex-row items-center bg-white border border-transparent hover:border-ivory transition-all duration-500 hover:shadow-premium p-4 md:p-6"
            >
              <div className="flex-shrink-0 w-32 h-44 mb-4 sm:mb-0 sm:mr-8 relative overflow-hidden aspect-[3/4]">
                <Image
                  src={
                    item.images && item.images.length > 0
                      ? item.images[0].url
                      : "/no-image.jpg"
                  }
                  alt={item.productName}
                  fill
                  sizes="(max-width: 768px) 100vw, 128px"
                  className="object-cover border border-ivory/50 transition-transform duration-700 group-hover:scale-105"
                />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-secondary text-primary tracking-wide mb-2 uppercase">
                  {item.productName}
                </h2>
                <p className="text-grey-dark font-main font-semibold text-lg">
                  ₹{item.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
                <p className="text-[10px] uppercase tracking-widest text-secondary mt-3">
                  In Stock - Handcrafted
                </p>
              </div>

              <div className="flex items-center gap-6 mt-6 sm:mt-0 pt-6 sm:pt-0 border-t sm:border-t-0 sm:border-l border-ivory/50 sm:pl-8">
                <button
                  onClick={() => handleMoveToCart(item._id)}
                  className="btn-primary !px-6 !py-2.5 text-[10px] uppercase tracking-[0.2em]"
                >
                  Move to Cart
                </button>
                <button
                  onClick={() => handleRemove(item._id)}
                  className="p-2 text-grey-medium hover:text-primary transition-colors duration-300"
                  title="Remove from Wishlist"
                >
                  <FaTrashAlt size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Wishlist Summary Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-ivory/20 p-8 shadow-premium border border-ivory/50 sticky top-40">
            <h2 className="text-2xl font-secondary text-primary mb-8 tracking-wide uppercase border-b border-secondary/20 pb-4">
              Wishlist Summary
            </h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-sm font-main text-grey-medium">
                <span className="tracking-wide">Total Items</span>
                <span className="font-semibold text-grey-dark">{wishlistItems.length}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-main text-grey-medium">
                <span className="tracking-wide">Estimated Subtotal</span>
                <span className="font-semibold text-grey-dark">
                  ₹{wishlistItems.reduce((acc, item) => acc + item.price, 0).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            <p className="text-[10px] text-grey-medium font-main italic leading-relaxed text-center opacity-70">
              Save your favorite pieces and bring them home when the moment is right.
            </p>

            <div className="mt-8 pt-6 border-t border-ivory flex justify-center">
               <div className="text-[9px] uppercase tracking-widest text-center text-secondary font-medium">
                 Your Personalized Collection
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
