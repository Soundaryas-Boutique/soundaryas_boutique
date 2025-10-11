"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { useSession } from "next-auth/react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      if (status === 'authenticated') {
        try {
          const res = await fetch('/api/cart');
          if (res.ok) {
            const data = await res.json();
            setCartItems(data.items);
          } else {
            console.error('Failed to fetch cart:', res.statusText);
            setCartItems([]);
          }
        } catch (error) {
          console.error('Failed to fetch cart:', error);
          setCartItems([]);
        } finally {
          setLoading(false);
        }
      } else if (status === 'unauthenticated') {
        setCartItems([]);
        setLoading(false);
      }
    };

    fetchCart();
  }, [status]);

  const addToCart = async (product) => {
    if (status !== 'authenticated') {
      alert("Please log in to add items to your cart.");
      return false;
    }

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product._id,
          productName: product.productName,
          price: product.discountPrice || product.price,
          quantity: 1,
          selectedColor: product.selectedColor || null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setCartItems(data.items);
        return true;
      } else {
        console.error('Failed to add to cart:', res.statusText);
        return false;
      }
    } catch (error) {
      console.error('Failed to add to cart:', error);
      return false;
    }
  };

  const removeFromCart = async (productId, selectedColor) => {
    // This function now needs to be refactored to call an API route
    // For now, we will leave it as a placeholder to avoid breaking the app
    console.log('Remove from cart is not yet implemented with API calls.');
  };

  const updateQuantity = async (productId, selectedColor, newQuantity) => {
    // This function now needs to be refactored to call an API route
    console.log('Update quantity is not yet implemented with API calls.');
  };

  const clearCart = async () => {
    // This function now needs to be refactored to call an API route
    console.log('Clear cart is not yet implemented with API calls.');
  };

  const cartTotal = cartItems.reduce(
    (total, item) => total + (item.price) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};