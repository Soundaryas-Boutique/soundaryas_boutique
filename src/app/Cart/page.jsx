"use client";

import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { FaTrashAlt } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";

export default function CartPage() {
  const { data: session } = useSession();
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();

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

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <p className="text-2xl text-gray-600 font-semibold mb-4">
          Your cart is empty.
        </p>
        <Link
          href="/collections"
          className="bg-[#B22222] text-white font-bold py-3 px-6 rounded-full transition-colors hover:bg-[#8B0000]"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-[1440px] mx-auto py-8 px-4 md:px-8">
      <h1 className="text-4xl font-bold text-[#B22222] mb-8 text-center">
        Your Shopping Cart
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={`${item._id}_${item.selectedColor}`} // Use ID and Color as key
              className="flex items-center border rounded-lg p-4 shadow-sm"
            >
              <Image
                src={
                  item.images && item.images.length > 0
                    ? item.images[0].url
                    : "/no-image.jpg"
                }
                alt={item.productName}
                width={120}
                height={120}
                className="rounded-lg mr-4"
              />
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800">
                  {item.productName}
                </h2>
                {/* ✅ Display the selected color */}
                {item.selectedColor && (
                  <p className="text-sm text-gray-500 mt-1">Color: {item.selectedColor}</p>
                )}
                <p className="text-gray-600">₹{item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) =>
                    // ✅ Pass the selectedColor to updateQuantity
                    updateQuantity(item._id, item.selectedColor, parseInt(e.target.value))
                  }
                  className="w-16 text-center border rounded-md p-1"
                />
                <p className="font-semibold text-lg min-w-[80px] text-right">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  // ✅ Pass the selectedColor to removeFromCart
                  onClick={() => removeFromCart(item._id, item.selectedColor)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <FaTrashAlt size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Cart Summary */}
        <div className="lg:col-span-1 border rounded-lg p-6 shadow-md bg-gray-50 h-fit">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Cart Summary
          </h2>
          <div className="flex justify-between items-center text-lg mb-2">
            <span>Subtotal:</span>
            <span className="font-semibold">₹{cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center text-xl font-bold text-[#B22222] border-t pt-4 mt-4">
            <span>Total:</span>
            <span>₹{cartTotal.toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full mt-6 bg-green-600 text-white font-bold py-3 px-6 rounded-full transition-colors hover:bg-green-700 disabled:opacity-50"
            disabled={!session || cartItems.length === 0}
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}