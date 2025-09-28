"use client";
import { useEffect, useRef } from "react"; // ✅ Import useRef
import Link from "next/link";
import { useCart } from "@/app/context/CartContext";

export default function SuccessPage() {
  const { clearCart } = useCart();
  const cartCleared = useRef(false); // ✅ Use a ref to track if cart has been cleared

  useEffect(() => {
    // ✅ Only clear the cart if it hasn't been cleared already
    if (!cartCleared.current) {
      clearCart();
      cartCleared.current = true;
    }
  }, [clearCart]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center p-6">
      <h1 className="text-4xl font-bold text-green-600 mb-4">Payment Successful! 🎉</h1>
      <p className="text-lg text-gray-700 mb-6">
        Thank you for your purchase. Your order has been placed successfully and will be processed shortly.
      </p>
      <Link href="/Profile" className="bg-[#B22222] text-white font-bold py-3 px-6 rounded-full transition-colors hover:bg-[#8B0000]">
        View My Orders
      </Link>
    </div>
  );
}