"use client";
import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/app/context/CartContext';
import { useSession } from 'next-auth/react';
import { loadStripe } from '@stripe/stripe-js';

export default function CartDrawer() {
  const { data: session } = useSession();
  const { cartItems, removeFromCart, updateQuantity, cartTotal, isCartOpen, setIsCartOpen } = useCart();

  const handleCheckout = async () => {
    if (!session) {
      alert("Please sign in to proceed to checkout.");
      return;
    }

    try {
      const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);
      const stripe = await stripePromise;

      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
    }
  };

  return (
    <Transition.Root show={isCartOpen} as={Fragment}>
      <Dialog as="div" className="relative z-[200]" onClose={() => setIsCartOpen(false)}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-500"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-2xl traditional-border">
                    <div className="flex-1 overflow-y-auto px-6 py-8 md:px-10 no-scrollbar">
                      <div className="flex items-start justify-between border-b border-ivory pb-6 mb-8">
                        <Dialog.Title className="text-xl font-secondary text-primary uppercase tracking-tight flex items-center gap-3">
                          <ShoppingBag className="w-6 h-6" />
                          <span>Your Shopping Bag</span>
                          <span className="text-xs font-main text-grey-medium lowercase">({cartItems.length} items)</span>
                        </Dialog.Title>
                        <button
                          type="button"
                          className="p-2 text-primary hover:text-black transition-colors"
                          onClick={() => setIsCartOpen(false)}
                        >
                          <X className="h-6 w-6" />
                        </button>
                      </div>

                      {cartItems.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20 text-center">
                          <div className="w-12 h-12 rounded-full bg-ivory flex items-center justify-center mb-6">
                            <ShoppingBag className="w-6 h-6 text-secondary/50" />
                          </div>
                          <p className="text-sm font-main text-grey-medium italic mb-8">
                            "Your collection is waiting for its first story."
                          </p>
                          <button
                            onClick={() => setIsCartOpen(false)}
                            className="text-[10px] uppercase tracking-widest font-bold text-primary border-b border-primary pb-1 hover:text-secondary hover:border-secondary transition-all"
                          >
                            Explore Our Curation
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-8">
                          {cartItems.map((item) => (
                            <div key={`${item.productId}-${item.selectedColor}`} className="flex gap-4 group">
                              <div className="h-28 w-20 flex-shrink-0 overflow-hidden border border-ivory/50 silk-bg relative shadow-sm">
                                <Image
                                  src={item.images?.[0]?.url || "/no-image.jpg"}
                                  alt={item.productName}
                                  fill
                                  className="object-cover transition-transform group-hover:scale-105"
                                  sizes="80px"
                                />
                              </div>

                              <div className="flex flex-1 flex-col pt-1">
                                <div className="flex justify-between items-start">
                                  <h4 className="text-[13px] font-secondary text-primary uppercase tracking-tight leading-tight max-w-[180px]">
                                    {item.productName}
                                  </h4>
                                  <p className="text-sm font-bold text-grey-dark">₹{item.price.toLocaleString()}</p>
                                </div>
                                
                                {item.selectedColor && (
                                  <p className="text-[9px] uppercase tracking-widest text-secondary mt-1">{item.selectedColor}</p>
                                )}

                                <div className="mt-auto flex items-center justify-between">
                                  <div className="flex items-center border border-ivory bg-ivory/20 px-1 py-0.5">
                                    <button 
                                      onClick={() => updateQuantity(item.productId, item.selectedColor, item.quantity - 1)}
                                      className="p-1 hover:text-primary transition-colors"
                                    >
                                      <Minus size={12} />
                                    </button>
                                    <span className="px-3 text-xs font-bold text-grey-dark min-w-[24px] text-center">{item.quantity}</span>
                                    <button 
                                      onClick={() => updateQuantity(item.productId, item.selectedColor, item.quantity + 1)}
                                      className="p-1 hover:text-primary transition-colors"
                                    >
                                      <Plus size={12} />
                                    </button>
                                  </div>
                                  <button
                                    onClick={() => removeFromCart(item.productId, item.selectedColor)}
                                    className="text-grey-medium hover:text-primary transition-colors p-1"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {cartItems.length > 0 && (
                      <div className="border-t border-ivory/80 px-6 py-8 md:px-10 bg-ivory/10">
                        <div className="flex justify-between items-center mb-6">
                          <span className="text-[11px] uppercase tracking-[0.3em] text-grey-medium">Subtotal</span>
                          <span className="text-xl font-bold text-primary">₹{cartTotal.toLocaleString()}</span>
                        </div>
                        <p className="text-[10px] text-grey-medium italic mb-8 text-center bg-white/50 py-2">
                          Complimentary boutique shipping included
                        </p>
                        
                        <div className="space-y-4">
                          <Link
                            href="/Cart"
                            onClick={() => setIsCartOpen(false)}
                            className="flex items-center justify-center gap-3 w-full border-2 border-primary text-primary py-4 text-xs uppercase tracking-[0.25em] font-bold hover:bg-ivory transition-all group"
                          >
                            <span>View Shopping Bag</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </Link>

                          <button
                            onClick={handleCheckout}
                            disabled={!session}
                            className="w-full bg-primary text-white py-4.5 text-xs uppercase tracking-[0.25em] font-bold hover:bg-black transition-all shadow-premium flex items-center justify-center gap-3 disabled:opacity-50 group"
                          >
                            <span>Secure Checkout</span>
                            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                          </button>
                          
                          {!session && (
                            <p className="text-[9px] text-center text-secondary uppercase tracking-[0.2em] font-bold animate-pulse">
                              Please sign in to proceed
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Decorative Bottom Pattern */}
                    <div className="h-1.5 w-full bg-gradient-to-r from-secondary/40 via-secondary to-secondary/40"></div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
