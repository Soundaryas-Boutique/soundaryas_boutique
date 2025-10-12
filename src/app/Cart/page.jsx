"use client";
import { useCart } from "@/app/context/CartContext";
import Image from "next/image";
import Link from "next/link";
import { FaTrashAlt } from "react-icons/fa";
import { loadStripe } from "@stripe/stripe-js";
import { useSession } from "next-auth/react";
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const { data: session } = useSession();
  const { cartItems, removeFromCart, updateQuantity, cartTotal, loading } = useCart();
  const router = useRouter();

  const handleCheckout = async () => {
    if (!session) {
      alert("Please sign in to proceed to checkout.");
      return;
    }

    try {
      const stripePromise = loadStripe(
        process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
      );
      const stripe = await stripePromise;

      // 1. Create a payment intent on the server
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: cartItems }),
      });
      const { clientSecret } = await response.json();

      // 2. Confirm the card payment on the client
      const { paymentIntent, error } = await stripe.confirmPayment({
        elements: null, // You would use a Stripe Element here for a full form
        clientSecret: clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/success`,
        },
        redirect: 'if_required',
      });

      if (error) {
        alert(`Payment failed: ${error.message}`);
        console.error("Payment Error:", error);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        // 3. Confirm the order status from the database
        const confirmOrderResponse = await fetch('/api/confirm-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ paymentIntentId: paymentIntent.id }),
        });

        if (confirmOrderResponse.ok) {
          router.push('/success');
        } else {
          router.push('/error'); // Redirect to an error page
        }
      }
    } catch (error) {
      console.error("Checkout failed:", error);
      alert("An error occurred during checkout. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <p className="text-2xl text-gray-600 font-semibold mb-4">Loading your cart...</p>
      </div>
    );
  }

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
        <div className="lg:col-span-2 space-y-4">
          {cartItems.map((item) => (
            <div
              key={`${item.productId}_${item.selectedColor}`}
              className="flex items-center border rounded-lg p-4 shadow-sm"
            >
              <div className="flex-shrink-0 w-24 h-24 mr-4 relative">
                {item.images && item.images.length > 0 ? (
                  <Image
                    src={item.images[0].url}
                    alt={item.productName}
                    fill
                    sizes="96px"
                    className="rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                    No Image
                  </div>
                )}
              </div>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-gray-800">
                  {item.productName}
                </h2>
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
                    updateQuantity(item.productId, item.selectedColor, parseInt(e.target.value))
                  }
                  className="w-16 text-center border rounded-md p-1"
                />
                <p className="font-semibold text-lg min-w-[80px] text-right">
                  ₹{(item.price * item.quantity).toFixed(2)}
                </p>
                <button
                  onClick={() => removeFromCart(item.productId, item.selectedColor)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <FaTrashAlt size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

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