"use client";

import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { FaTrashAlt } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";

export default function CartPage() {
  const { data: session } = useSession();
  const { cartItems, removeFromCart, updateQuantity, cartTotal, loading } = useCart();

  const handleCheckout = async () => {
    if (!session) {
      alert("Please sign in to proceed to checkout.");
      return;
    }

    try {
      const stripePromise = loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
        { locale: 'en' }
      );
      const stripe = await stripePromise;

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ items: cartItems }),
      });

      const { url } = await response.json();
      if (response.ok) {
        window.location.href = url;
      } else {
        alert("Failed to create checkout session. Please try again.");
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("An error occurred during checkout. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4 bg-white">
        <div className="w-12 h-12 border-4 border-secondary border-t-primary rounded-full animate-spin mb-4"></div>
        <p className="text-xl font-secondary text-primary tracking-wide">Refining your selections...</p>
      </div>
    );
  }

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 bg-white">
        <div className="w-16 h-0.5 bg-secondary/30 mb-6"></div>
        <h1 className="text-3xl md:text-4xl font-secondary text-primary mb-6 tracking-tight uppercase">
          Your Cart is Empty
        </h1>
        <p className="text-grey-medium font-main mb-10 max-w-md mx-auto italic">
          "The most beautiful stories begin with a single choice. Let's find a piece that speaks to you."
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
          Your Shopping Cart
        </h1>
        <div className="flex items-center gap-4 mt-6">
          <div className="h-[1px] w-12 lg:w-20 bg-secondary/40"></div>
          <div className="w-2.5 h-2.5 rotate-45 border border-secondary/50"></div>
          <div className="h-[1px] w-12 lg:w-20 bg-secondary/40"></div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          {cartItems.map((item) => (
            <div
              key={`${item.productId}_${item.selectedColor}`}
              className="group flex flex-col sm:flex-row items-center bg-white border border-transparent hover:border-ivory transition-all duration-500 hover:shadow-premium p-4 md:p-6"
            >
              <div className="flex-shrink-0 w-32 h-44 mb-4 sm:mb-0 sm:mr-8 relative overflow-hidden aspect-[3/4]">
                {item.images && item.images.length > 0 ? (
                  <Image
                    src={item.images[0].url}
                    alt={item.productName}
                    fill
                    sizes="(max-width: 768px) 100vw, 128px"
                    className="object-cover border border-ivory/50 transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-ivory/30 flex items-center justify-center border border-ivory/50">
                    <span className="text-[10px] uppercase tracking-widest text-grey-medium">Boutique</span>
                  </div>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-xl font-secondary text-primary tracking-wide mb-2 uppercase">
                  {item.productName}
                </h2>
                {item.selectedColor && (
                  <p className="text-xs uppercase tracking-widest text-secondary font-medium mb-3 flex items-center justify-center sm:justify-start gap-2">
                    <span className="w-2 h-2 rounded-full bg-secondary"></span>
                    {item.selectedColor}
                  </p>
                )}
                <p className="text-grey-dark font-main font-semibold text-lg">
                  ₹{item.price.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
              </div>

              <div className="flex items-center gap-6 mt-6 sm:mt-0 pt-6 sm:pt-0 border-t sm:border-t-0 sm:border-l border-ivory/50 sm:pl-8">
                <div className="flex items-center border border-ivory bg-ivory/10 px-2">
                  <span className="text-[10px] uppercase tracking-widest text-secondary mr-1 font-medium">Qty:</span>
                  <select
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item.productId, item.selectedColor, parseInt(e.target.value))
                    }
                    className="bg-transparent border-none py-2 pr-4 font-main text-sm focus:ring-0 cursor-pointer appearance-none"
                  >
                    {[...Array(10)].map((_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1}
                      </option>
                    ))}
                  </select>
                </div>
                <p className="font-main font-bold text-primary text-xl min-w-[100px] text-right">
                  ₹{(item.price * item.quantity).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                </p>
                <button
                  onClick={() => removeFromCart(item.productId, item.selectedColor)}
                  className="p-2 text-grey-medium hover:text-primary transition-colors duration-300"
                  title="Remove Item"
                >
                  <FaTrashAlt size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-ivory/20 p-8 shadow-premium border border-ivory/50 sticky top-40">
            <h2 className="text-2xl font-secondary text-primary mb-8 tracking-wide uppercase border-b border-secondary/20 pb-4">
              Order Summary
            </h2>
            
            <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center text-sm font-main text-grey-medium">
                <span className="tracking-wide">Subtotal</span>
                <span className="font-semibold text-grey-dark">₹{cartTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-main text-grey-medium">
                <span className="tracking-wide">Shipping</span>
                <span className="text-xs uppercase text-secondary font-bold">Calculated at Next Step</span>
              </div>
            </div>

            <div className="flex justify-between items-center text-xl font-main text-primary border-t border-secondary/30 pt-6 mb-10">
              <span className="font-secondary tracking-widest uppercase text-lg">Total</span>
              <span className="font-bold tracking-tighter">₹{cartTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</span>
            </div>

            <div className="space-y-4">
              <button
                onClick={handleCheckout}
                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed py-4"
                disabled={!session || cartItems.length === 0}
              >
                Secure Checkout
              </button>
              
              {!session && (
                <p className="text-[10px] text-center text-secondary uppercase tracking-[0.2em] font-medium animate-pulse">
                  Please Sign In to Checkout
                </p>
              )}
            </div>

            {/* Trust Badges */}
            <div className="mt-8 pt-6 border-t border-ivory flex justify-center gap-4 opacity-40 grayscale">
               <div className="text-[9px] uppercase tracking-widest text-center">
                 Traditional Craftsmanship | Secure Payments
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}