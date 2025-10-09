"use client";
import { useWishlist } from "@/app/context/WishlistContext"; // Assuming you have WishlistContext
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
    if (confirm("Are you sure you want to remove this item from your wishlist?")) {
      removeFromWishlist(id);
    }
  };

  if (wishlistItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
        <p className="text-2xl text-gray-600 font-semibold mb-4">
          Your wishlist is empty.
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
        Your Wishlist
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {wishlistItems.map((item) => (
            <div
              key={item._id}
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
                <p className="text-gray-600">₹{item.price.toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => handleMoveToCart(item._id)}
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                  Move to Cart
                </button>
                <button
                  onClick={() => handleRemove(item._id)}
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
            Wishlist Summary
          </h2>
          <div className="flex justify-between items-center text-lg mb-2">
            <span>Total Items:</span>
            <span className="font-semibold">{wishlistItems.length}</span>
          </div>
          <div className="flex justify-between items-center text-xl font-bold text-[#B22222] border-t pt-4 mt-4">
            <span>Total Value:</span>
            <span>₹{wishlistItems.reduce((acc, item) => acc + item.price, 0).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
